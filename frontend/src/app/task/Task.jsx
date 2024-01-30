import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useParams} from "react-router-dom";
import TwoLetterName from "../components/TwoLetterName.jsx";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import NoDataFound from "../components/NoDataFound.jsx";
import Loader from "../components/Loader.jsx";
import {BiArchive, BiChevronLeft, BiChevronRight, BiEditAlt, BiRotateLeft, BiTrash} from "react-icons/bi";
import Popup from "reactjs-popup";
import useStore from "../../store/store.js";

const Task = () => {
    const {user} = useStore();
    const location = useLocation();
    const [project, setProject] = useState(null)
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const popupRef = useRef();
    const [loadingAction, setLoadingAction] = useState(false)
    const {id} = useParams();
    const [filter, setFilter] = useState({
        keyword: '',
        members: [],
        page: 1,
        limit: 50,
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
                // getTasks()
            }
        })
    }
    const getTasks = () => {
        setLoading(true)
        ApiService.GET(ApiRoutes.task + '/' + id, (res) => {
            setLoading(false)
            if (res.status === 'ok') {
                setProject(res.data.project)
            }
        })
    }
    const manageStatus = () => {}
    const deleteProject = () => {}
    const filterPriority = () => {}
    const filterStatus = () => {}
    const filterLabel = () => {}
    const isActive = () => {
        return true
    }
    const handlePrevPage = () => {
        setFilter((prevFilter) => ({ ...prevFilter, page: prevFilter.page - 1 }));
    };

    const handleNextPage = () => {
        setFilter((prevFilter) => ({ ...prevFilter, page: prevFilter.page + 1 }));
    };
    const startItemIndex = (parseInt(filter.page) - 1) * parseInt(filter.limit) + 1;
    const endItemIndex = Math.min(parseInt(filter.page) * parseInt(filter.limit), parseInt(pageInfo.totalData));
    useEffect(() => {
        getProject()
    }, [location])
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
                                    <span
                                        className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-md bg-cyan-500`}>
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
                                            <Popup className={`w-auto`} key={member._id}
                                                trigger={open => (
                                                    <div className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 first:ms-0  ms-[-10px] hover:z-10 ${isActive() ? 'border-violet-600 z-10' : 'border-white'}`} >
                                                        {member?.avatarFullPath ? (
                                                            <img className={`cursor-pointer`} src={member.avatarFullPath} alt=""/>
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
                                <select className={`input min-w-48 me-4`} onChange={filterPriority}>
                                    <option value="">All State</option>
                                    <option value="my">All Projects</option>
                                    <option value="shared">Shared Projects</option>
                                </select>
                                <select className={`input min-w-48 me-4`} onChange={filterPriority}>
                                    <option value="">All Priority</option>
                                    <option value="my">All Projects</option>
                                    <option value="shared">Shared Projects</option>
                                </select>
                                <select className={`input min-w-48 me-4`} onChange={filterStatus}>
                                    <option value="">All Status</option>
                                    <option value="archive">Archive</option>
                                </select>
                                <select className={`input min-w-48 me-4`} onChange={filterLabel}>
                                    <option value="">All Label</option>
                                    <option value="archive">Archive</option>
                                </select>
                            </div>
                            <input type="text" className={`input min-w-48 me-4`} placeholder={`Search`}
                                   value={filter.keyword}
                                   onChange={(event) => setFilter((prevVal) => ({
                                       ...prevVal,
                                       keyword: event.target.value
                                   }))}/>
                            <Link to={`/dashboard/project/create`} className="btn-black">New Task</Link>
                        </div>
                    </div>
                    {tasks.length > 0 && !loading ? (
                        <>
                            <div className={`h-[79vh] overflow-auto`}>
                                {
                                    tasks.map((task) => {
                                        return (
                                            <div className="rounded-lg shadow bg-gray-100 mb-3" key={task._id}>
                                                <div className="space-y-4 divide-y pb-3">
                                                    <div className="flex px-4 pt-3 items-center">
                                                        <Link to={`/dashboard`} className="flex cursor-pointer items-center leading-5 text-gray-700 transition duration-150 ease-in-out">
                                                            <div className="truncate text-gray-500 ms-4">
                                                                <div className={`flex items-center`}>
                                                                    <div className={`font-bold me-2`}>{task.name}</div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                        <div className="ml-auto flex space-x-3">
                                                            <Link to={`/dashboard/project/${task._id}`} className={`cursor-pointer text-[20px]`}><BiEditAlt></BiEditAlt></Link>
                                                            {task.status === 'active' ? (
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
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(task._id)}>Yes</button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Popup>
                                                            ) : (
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
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(task._id)}>Yes</button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </Popup>
                                                            )}

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
                                                                            <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => deleteProject(project._id)}>Yes</button>
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
                    ) :  tasks.length === 0 && !loading ? (
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