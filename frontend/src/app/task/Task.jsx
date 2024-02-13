import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import TwoLetterName from "../components/TwoLetterName.jsx";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import NoDataFound from "../components/NoDataFound.jsx";
import Loader from "../components/Loader.jsx";
import {
    BiArchive,
    BiBadgeCheck,
    BiChevronLeft,
    BiChevronRight,
    BiRotateLeft,
    BiSolidBadgeCheck,
    BiTrash
} from "react-icons/bi";
import Popup from "reactjs-popup";
import {toast} from "react-toastify";
import Select from "react-select";

const Task = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [labels, setLabels] = useState([])
    const [state, setState] = useState([])
    const [loading, setLoading] = useState(false)
    const [taskLoading, setTaskLoading] = useState(false)
    const popupRef = useRef();
    const [loadingAction, setLoadingAction] = useState(false)
    const {id} = useParams();
    const isInitialRender = useRef(true);
    const [filter, setFilter] = useState({
        keyword: '',
        members: [],
        status: ['active'],
        priority: [],
        state: [],
        label: [],
        page: 1,
        limit: 50,
    })
    const [filterDefault, setFilterDefault] = useState({
        status: [{value: 'active', label: 'Active'}],
        priority: [],
        state: [],
        label: [],
    })
    const [pageInfo, setPageInfo] = useState({
        totalData: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const getProject = () => {
        setLoading(true)
        ApiService.GET(ApiRoutes.project + '/' + id, (res) => {
            setLoading(false)
            if (res.status === 'ok') {
                setProject(res.data)
                getTasks()
            }
        })
    }
    const getTasks = (isLoading = true) => {
        if (isLoading) {
            setTaskLoading(true)
        }
        ApiService.GET(ApiRoutes.task+ '/' + id +
            '?keyword=' + filter.keyword +
            '&page=' + filter.page +
            '&limit=' + filter.limit +
            '&status=' + filter.status +
            '&priority=' + filter.priority +
            '&label=' + filter.label +
            '&member=' + filter.members +
            '&state=' + filter.state, (res) => {
            setTaskLoading(false)
            if (res.status === 'ok') {
                setPageInfo(res.data.pageInfo)
                setTasks(res.data.task)
            }
        })
    }
    const manageStatus = (id, status) => {
        setLoadingAction(true)
        ApiService.PATCH(ApiRoutes.task+'/'+ id +'/update/status', {status:status},(res) => {
            setLoadingAction(false)
            if (res.status === 'ok') {
                popupRef.current.close;
                toast.success(res.message);
                getTasks(false);
            }
        })
    }
    const deleteTask = (id) => {
        setLoadingAction(true)
        ApiService.DELETE(ApiRoutes.task+'/'+ id,(res) => {
            setLoadingAction(false)
            if (res.status === 'ok') {
                popupRef.current.close;
                toast.success(res.message);
                getTasks(false);
            }
        })
    }

    const getLabel = () => {
        ApiService.GET(ApiRoutes.label+'/'+ id,(res) => {
            if (res.status === 'ok') {
                let options = []
                res.data.map((v) => {
                    options.push({value: v._id, label: v.name})
                })
                setLabels(options)
            }
        })
    }
    const getState = () => {
        ApiService.GET(ApiRoutes.state+'/'+ id,(res) => {
            if (res.status === 'ok') {
                let options = []
                res.data.map((v) => {
                    options.push({value: v._id, label: v.name})
                })
                setState(options)
            }
        })
    }
    const isActive = (member_id) => {
        let index = filter.members.indexOf(member_id);
        return index > -1;

    }
    const handleMember = (member_id) => {
        if (filter.members.length === 0) {
            setFilter((prevData) => ({
                    ...prevData,
                    members: [member_id],
                })
            );
        } else {
            let members = [...filter.members]
            let index = filter.members.indexOf(member_id)
            if (index > -1) {
               members.splice(members.indexOf(member_id), 1)
            } else {
                members.push(member_id)
            }
            setFilter((prevData) => ({
                    ...prevData,
                    members: members,
                })
            );
        }
    }
    const getIconOfPriority = (priority) => {
        if (priority === 'highest') {
            return '/src/assets/highest.svg'
        } else if (priority === 'high') {
            return '/src/assets/high.svg'
        } else if (priority === 'medium') {
            return '/src/assets/medium.svg'
        } else if (priority === 'low') {
            return '/src/assets/low.svg'
        } else {
            return '/src/assets/lowest.svg'
        }
    }
    const handlePrevPage = () => {
        setFilter((prevFilter) => ({ ...prevFilter, page: prevFilter.page - 1 }));
    };

    const handleNextPage = () => {
        setFilter((prevFilter) => ({ ...prevFilter, page: prevFilter.page + 1 }));
    };
    const startItemIndex = (parseInt(filter.page) - 1) * parseInt(filter.limit) + 1;
    const endItemIndex = Math.min(parseInt(filter.page) * parseInt(filter.limit), parseInt(pageInfo.totalData));
    const handleSubmitTask = (e) => {
        e.preventDefault()
        setLoadingAction(true);
        let requestData = {
            name: e.target.name.value,
        }
        ApiService.POST(ApiRoutes.task+'/'+id, requestData, (res) => {
            setLoadingAction(false);
            if (res.status === 'ok') {
                popupRef.current.close;
                navigate(`/dashboard/project/${project._id}/task/${res.task_id}`)
            }
        })
    }
    useEffect(() => {
        getProject()
        getLabel()
        getState()
    }, [location])
    useEffect(() => {
        if (isInitialRender.current) {
            return;
        }
        const timeoutId = setTimeout(() => {
            getTasks();
        }, 800);
        return () => clearTimeout(timeoutId);
    }, [filter.keyword]);
    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }
        getTasks()
    }, [filter.page, filter.limit, filter.state, filter.priority, filter.status, filter.label, filter.members])
    return (
        <>
            {project != null && !loading ? (
                <>
                    <div className="mb-4 flex justify-between">
                        <div className={`flex items-center`}>
                            <div className={`flex cursor-pointer items-center leading-5 text-gray-700 transition duration-150 ease-in-out me-10`}>
                                {project.iconFullPath ? (
                                    <span className="block h-9 w-9 flex-shrink-0 rounded-md">
                                        <img className={`rounded-md`} src={project.iconFullPath} alt=""/>
                                    </span>
                                ) : (
                                    <span className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-md bg-cyan-500`}>
                                        <TwoLetterName classes={`font-normal`} name={project.name}/>
                                    </span>
                                )}
                                <div className="truncate text-gray-500 ms-4">
                                    <div className={`flex items-center`}>
                                        <div className={`font-bold me-2`}>{project.name}</div>
                                    </div>
                                    <div className={`text-sm`}>{project.description}</div>
                                </div>
                            </div>
                            <div className={`flex items-center`}>
                                {
                                    project.members.map((member) => {
                                        return (
                                            <Popup  className={`w-auto`} key={member._id}
                                                trigger={open => (
                                                    <div onClick={() => handleMember(member._id)} className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 first:ms-0  ms-[-10px] hover:z-10 
                                                         ${isActive(member._id) ? 'border-violet-600 z-10' : 'border-white'}`} >
                                                        {member?.avatarFullPath ? (
                                                            <img className={`cursor-pointer rounded-full`} src={member.avatarFullPath} alt=""/>
                                                        ) : (
                                                            <span className={`cursor-pointer flex h-full w-full items-center justify-center rounded-full ${member?.color}`}>
                                                                <TwoLetterName classes={`font-normal`} name={member.name}/>
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                on={['hover']}
                                                position="bottom center"
                                                closeOnDocumentClick
                                            >
                                                <span > {member.name} </span>
                                            </Popup>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="flex items-center  ltr:ml-auto rtl:mr-auto">
                            <div className={`flex items-center`}>
                                <Popup offsetX={15} ref={popupRef}  trigger={<button className="btn-white me-4">Filter</button>} position="bottom right">
                                    {close => (
                                        <div className={`px-2 -2 max-w-72`}>
                                            <label>State</label>
                                            <Select className={`min-w-64 mb-4`} isMulti defaultValue={filterDefault.state} isClearable={false} options={state}
                                                    onChange={(newValue) => {
                                                        setFilter(
                                                            (prevData) => ({
                                                                ...prevData,
                                                                state: newValue.map(each => each.value),
                                                            })
                                                        );
                                                        setFilterDefault((prevState) => ({
                                                            ...prevState,
                                                            state: newValue
                                                        }))
                                                    }}></Select>
                                            <label>Priority</label>
                                            <Select className={`min-w-64 mb-4`} isMulti defaultValue={filterDefault.priority} isClearable={false} options={[
                                                {value: 'highest', label: 'Highest'},
                                                {value: 'high', label: 'High'},
                                                {value: 'medium', label: 'Medium'},
                                                {value: 'low', label: 'Low'},
                                                {value: 'lowest', label: 'Lowest'},
                                            ]} onChange={(newValue) => {
                                                setFilter(
                                                    (prevData) => ({
                                                        ...prevData,
                                                        priority: newValue.map(each => each.value),
                                                    })
                                                );
                                                setFilterDefault((prevState) => ({
                                                    ...prevState,
                                                    priority: newValue
                                                }))
                                            }}></Select>
                                            <label>Status</label>
                                            <Select className={`min-w-64 mb-4`} isMulti defaultValue={filterDefault.status} isClearable={false} options={[
                                                {value: 'archive', label: 'Archive'},
                                                {value: 'active', label: 'Active'},
                                                {value: 'complete', label: 'Complete'},
                                            ]} onChange={(newValue) => {
                                                setFilter(
                                                    (prevData) => ({
                                                        ...prevData,
                                                        status: newValue.map(each => each.value),
                                                    })
                                                );
                                                setFilterDefault((prevState) => ({
                                                    ...prevState,
                                                    status: newValue
                                                }))
                                            }}></Select>
                                            <label>Label</label>
                                            <Select className={`min-w-64 mb-4`} isMulti defaultValue={filterDefault.label} isClearable={false} options={labels}
                                                    onChange={(newValue) => {
                                                        setFilter(
                                                            (prevData) => ({
                                                                ...prevData,
                                                                label: newValue.map(each => each.value),
                                                            })
                                                        );
                                                        setFilterDefault((prevState) => ({
                                                            ...prevState,
                                                            label: newValue
                                                        }))
                                                    }}></Select>
                                        </div>
                                    )}
                                </Popup>

                            </div>
                            <input type="text" className={`input min-w-48 me-4`} placeholder={`Search`}
                                   value={filter.keyword}
                                   onChange={(event) => setFilter((prevVal) => ({
                                       ...prevVal,
                                       keyword: event.target.value
                                   }))}/>
                            <Popup offsetX={15} ref={popupRef}  trigger={<button className="btn-black">New Task</button>} position="bottom right">
                                {close => (
                                    <div className={`px-2 py-2 max-w-72`}>
                                        <form onSubmit={handleSubmitTask}>
                                            <div className="space-y-2 form-input">
                                                <label className="text-sm font-medium leading-none" htmlFor="name">
                                                    What's need to be done?
                                                </label>
                                                <input className="input" id="name" name={`name`}
                                                />
                                                <small className="text-red-500 text-sm invalid-feedback"></small>
                                            </div>
                                            <div className={`flex justify-end items-center mt-3`}>
                                                <button type={`button`}
                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                    onClick={close}>Close
                                                </button>
                                                <button type={`submit`} className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`}>Save</button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </Popup>
                        </div>
                    </div>
                    {tasks.length > 0 && !taskLoading ? (
                        <>
                            <div className={`h-[79vh] overflow-auto`}>
                                {
                                    tasks.map((task) => {
                                        return (
                                            <div className="rounded-lg shadow bg-gray-100 mb-3" key={task._id}>
                                                <div className="space-y-4 divide-y pb-3">
                                                    <div className={`flex px-4 pt-3 items-center ${task.status === 'complete' ? 'line-through' : ''}`}>
                                                        <Link to={`/dashboard/project/${project._id}/task/${task._id}`} className="flex cursor-pointer w-[90%] items-center leading-5 text-gray-700 transition duration-150 ease-in-out">
                                                            <div className="truncate text-gray-500">
                                                                <div className={`flex items-center`}>
                                                                    <div className={`font-bold me-16 w-80`}>
                                                                        <div className={`whitespace-pre-wrap`}>{task.name}</div>
                                                                        <div className={`text-gray-400 text-sm font-normal`}>#{task.number} opened by {task.creator.name}</div>
                                                                    </div>
                                                                    {task.label.length > 0 && (
                                                                        <div className={`flex items-center me-16 flex-wrap`}>
                                                                            {task.label.map(l => {
                                                                                return (
                                                                                    <div key={l._id}>
                                                                                        {l.description ? (
                                                                                            <Popup className={`w-auto`} key={l._id}
                                                                                                   trigger={open => (
                                                                                                       <div key={l._id} style={{backgroundColor: l.color}} className={`p-1 mb-1 leading-3 rounded-full font-bold text-white me-2 text-[11px]`}>{l.name}</div>
                                                                                                   )}
                                                                                                   on={['hover']}
                                                                                                   position="bottom center"
                                                                                                   closeOnDocumentClick
                                                                                            >
                                                                                                {l.description && (
                                                                                                    <span> {l.description} </span>
                                                                                                )}
                                                                                            </Popup>
                                                                                        ) : (
                                                                                            <div key={l._id} style={{backgroundColor: l.color}} className={`p-1 mb-1 leading-3 rounded-full font-bold text-white me-2 text-[11px]`}>{l.name}</div>
                                                                                        )}
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                    {task.priority && (
                                                                        <div className={`capitalize flex items-center me-16`}>
                                                                            <img className={`w-[20px]`} src={getIconOfPriority(task.priority)} alt=""/>
                                                                            {task.priority}
                                                                        </div>
                                                                    )}

                                                                    {task.state && (
                                                                        <div className={`capitalize border font-bold p-1 rounded-md text-[12px] flex items-center me-16`}>
                                                                            {task.state.name}
                                                                        </div>
                                                                    )}
                                                                    {task.user.length > 0 && (
                                                                        <div className={`flex items-center me-16`}>
                                                                            {
                                                                                task.user.map((member) => {
                                                                                    return (
                                                                                        <Popup className={`w-auto`} key={member._id}
                                                                                               trigger={open => (
                                                                                                   <div className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 first:ms-0  ms-[-10px] hover:z-10 border-white`} >
                                                                                                       {member?.avatarFullPath ? (
                                                                                                           <img className={`cursor-pointer rounded-full`} src={member.avatarFullPath} alt=""/>
                                                                                                       ) : (
                                                                                                           <span className={`cursor-pointer flex h-full w-full items-center justify-center rounded-full ${member?.color}`}>
                                                                                                           <TwoLetterName classes={`font-normal`} name={member.name}/>
                                                                                                       </span>
                                                                                                       )}
                                                                                                   </div>
                                                                                               )}
                                                                                               on={['hover']}
                                                                                               position="bottom center"
                                                                                               closeOnDocumentClick
                                                                                        >
                                                                                            <span > {member.name} </span>
                                                                                        </Popup>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )}

                                                                    <div>{task.formattedDate}</div>

                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="ml-auto flex space-x-3">
                                                            {task.status === 'complete' && (
                                                                <button className={`cursor-pointer text-[20px]`} onClick={() => manageStatus(task._id, 'active')}><BiSolidBadgeCheck /></button>
                                                            )}
                                                            {task.status !== 'complete' && (
                                                                <button className={`cursor-pointer text-[20px]`} onClick={() => manageStatus(task._id, 'complete')}><BiBadgeCheck /></button>
                                                            )}
                                                            {task.status === 'active' && (
                                                                <Popup offsetX={15} ref={popupRef}  trigger={<button><span
                                                                    className={`cursor-pointer text-[20px]`}><BiArchive></BiArchive></span>
                                                                </button>} position="bottom right">
                                                                    {close => (
                                                                        <div className={`px-2 py-2`}>
                                                                            <div className={`mb-4 text-sm text-red-500`}>Do you want to archive
                                                                                this task?
                                                                            </div>
                                                                            <div className={`flex justify-end items-center`}>
                                                                                <button
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>No
                                                                                </button>
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(task._id, 'archive')}>Yes</button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Popup>
                                                            )}
                                                            { task.status === 'archive' && (
                                                                <Popup offsetX={15} ref={popupRef}  trigger={<button><span
                                                                    className={`cursor-pointer text-[20px]`}><BiRotateLeft></BiRotateLeft></span>
                                                                </button>} position="bottom right">
                                                                    {close => (
                                                                        <div className={`px-2 py-2`}>
                                                                            <div className={`mb-4 text-sm text-red-500`}>Do you want to restore
                                                                                this task?
                                                                            </div>
                                                                            <div className={`flex justify-end items-center`}>
                                                                                <button
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>No
                                                                                </button>
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(task._id, 'active')}>Yes</button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Popup>
                                                            )
                                                            }

                                                            <Popup offsetX={15} trigger={<button><span
                                                                className={`cursor-pointer text-[20px]`}><BiTrash></BiTrash></span>
                                                            </button>} position="bottom right">
                                                                {close => (
                                                                    <div className={`px-2 py-2`}>
                                                                        <div className={`mb-4 text-sm text-red-500`}>Do you want to delete
                                                                            this task?
                                                                        </div>
                                                                        <div className={`flex justify-end items-center`}>
                                                                            <button
                                                                                className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                onClick={close}>No
                                                                            </button>
                                                                            <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => deleteTask(task._id)}>Yes</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Popup>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={`flex justify-between`}>
                                <div className={`flex items-center`}>
                                    <div>
                                        Show
                                        <select className={`input w-16 ms-2 me-2`} value={filter.limit} onChange={(event) => setFilter((prevFilter) =>({
                                            ...prevFilter,
                                            limit: event.target.value
                                        }))}>
                                            <option value={20}>20</option>
                                            <option value={50}>50</option>
                                            <option value={100}>100</option>
                                        </select>
                                    </div>
                                    <p>
                                        Showing  {startItemIndex} to {endItemIndex} of {pageInfo.totalData} items
                                    </p>
                                </div>
                                <div>
                                    <button className={`text-4xl disabled:opacity-40 disabled:cursor-not-allowed`} onClick={handleNextPage} disabled={!pageInfo.hasNextPage}>
                                        <BiChevronLeft />
                                    </button>
                                    <button className={`text-4xl disabled:opacity-40 disabled:cursor-not-allowed`} onClick={handlePrevPage} disabled={!pageInfo.hasPrevPage}>
                                        <BiChevronRight />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) :  tasks.length === 0 && !taskLoading ? (
                        <NoDataFound title={`No Task Found`}
                                     subtitle={`Please click "New Task" button to create a new task`}/>
                    ) : (
                        <Loader />
                    )
                    }
                </>
            ) : (
                project == null && !loading ? (
                    <NoDataFound title={`No Task Found`}
                                 subtitle={`Please click "New Task" button to create a new task`}/>
                ) : (
                    <Loader/>
                )
            )}


        </>
    );
};

export default Task;