import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import TwoLetterName from "../components/TwoLetterName.jsx";
import {BiArchive, BiTrash, BiEditAlt, BiRotateLeft, BiChevronRight, BiChevronLeft} from "react-icons/bi";
import Popup from "reactjs-popup";
import NoDataFound from "../components/NoDataFound.jsx";
import Loader from "../components/Loader.jsx";
import {toast} from "react-toastify";
import useStore from "../../store/store.js";

const Project = () => {
    const {setProject, user} = useStore();
    const popupRef = useRef();
    const [projects, setProjects] = useState([])
    const [status, setStatus] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadingAction, setLoadingAction] = useState(false)
    const [componentMounted, setComponentMounted] = useState(false);
    const [filter, setFilter] = useState({
        keyword: '',
        status: 'active',
        page: 1,
        limit: 50,
        project_type: '',
    })
    const [pageInfo, setPageInfo] = useState({
        totalData: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });
    const getProjects = (isLoading = true) => {
        if (isLoading) {
            setLoading(true)
        }
        ApiService.GET(ApiRoutes.project +
            '?keyword=' + filter.keyword +
            '&page=' + filter.page +
            '&status=' + filter.status +
            '&limit=' + filter.limit +
            '&project_type=' + filter.project_type, (res) => {
            if (isLoading) {
                setLoading(false)
            }
            if (res.status === 'ok') {
                setProjects(res.data.project)
                setPageInfo(res.data.pageInfo)
                setProject(res.data.project)
            }
        })
    }
    const getStatus = () => {
        ApiService.GET(ApiRoutes.project+'/status', (res) => {
            setStatus(res.data)
        })
    }
    const filterStatus = (e) => {
        setFilter((prevVal) => ({
            ...prevVal,
            status: e.target.value
        }))
    }
    const filterProject = (e) => {
        setFilter((prevVal) => ({
            ...prevVal,
            project_type: e.target.value
        }))
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
        if (!componentMounted) {
            getProjects();
            getStatus();
            setComponentMounted(true);
        }
    }, [componentMounted])
    useEffect(() => {
        if (componentMounted) {
            const timeoutId = setTimeout(() => {
                getProjects();
            }, 800);
            return () => clearTimeout(timeoutId);
        }
    }, [filter.keyword]);
    useEffect(() => {
        if (componentMounted) {
            getProjects();
        }
    }, [filter.status, filter.page, filter.limit, filter.project_type]);

    const manageStatus = (id) => {
        setLoadingAction(true)
        ApiService.PATCH(ApiRoutes.project+'/'+ id +'/update/status', {},(res) => {
            setLoadingAction(false)
            if (res.status === 'ok') {
                popupRef.current.close;
                toast.success(res.message);
                getProjects(false);
            }
        })
    }
    const deleteProject = (id) => {
        setLoadingAction(true)
        ApiService.DELETE(ApiRoutes.project+'/'+ id,(res) => {
            setLoadingAction(false)
            if (res.status === 'ok') {
                popupRef.current.close;
                toast.success(res.message);
                getProjects(false);
            }
        })
    }
    return (
        <>
            <div className="mb-4 flex justify-between">
                <div className={`flex items-center`}>
                    <select className={`input min-w-64 me-4`} onChange={filterProject}>
                        <option value="">All projects</option>
                        <option value="my">My Projects</option>
                        <option value="shared">Shared Projects</option>
                    </select>
                    <select className={`input min-w-64 capitalize`} onChange={filterStatus}>
                        {status.map(s => {
                            return (
                                <option className={`capitalize`} key={s.value} value={s.value}>{s.name}</option>
                            )
                        })}
                    </select>
                </div>

                <div className="flex items-center  ltr:ml-auto rtl:mr-auto">
                    <input type="text" className={`input min-w-64 me-4`} placeholder={`Search`} value={filter.keyword}
                           onChange={(event) => setFilter((prevVal) => ({
                               ...prevVal,
                               keyword: event.target.value
                           }))}/>
                    <Link to={`/dashboard/project/create`} className="btn-black">New Project</Link>
                </div>
            </div>
            {projects.length > 0 && !loading ? (
                <>
                    <div className={`h-[79vh] overflow-auto`}>
                        {
                            projects.map((project) => {
                                return (
                                    <div className="rounded-lg shadow bg-gray-100 mb-3" key={project._id}>
                                        <div className="space-y-4 divide-y pb-3">
                                            <div className="flex px-4 pt-3 items-center">
                                                <Link to={`/dashboard/project/${project._id}/task`}
                                                      className="flex cursor-pointer items-center leading-5 text-gray-700 transition duration-150 ease-in-out">
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
                                                            <div className={`border rounded-md px-1 flex items-center`}>
                                                                {
                                                                    project.user.avatarFullPath ? (
                                                                        <div className={`flex h-4 w-4 flex-shrink-0 rounded-full`}>
                                                                            <img className={`rounded-full`} src={project.user.avatarFullPath} alt=""/>
                                                                        </div>
                                                                    ) : (
                                                                        <span className={`flex items-center justify-center h-4 w-4 flex-shrink-0 rounded-full ${project.user.color}`}>
                                                                            <TwoLetterName classes={`font-normal text-[10px]`} name={project.user.name}/>
                                                                        </span>
                                                                    )
                                                                }
                                                                <div className={`ms-1 text-[12px]`}>
                                                                    {project.user.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`text-sm`}>{project.description}</div>
                                                    </div>
                                                </Link>
                                                {
                                                    project.user._id === user._id && (
                                                        <div className="ml-auto flex space-x-3">
                                                            <Link to={`/dashboard/project/${project._id}`} className={`cursor-pointer text-[20px]`}><BiEditAlt></BiEditAlt></Link>
                                                            {filter.status === 'active' ? (
                                                                <Popup offsetX={15} ref={popupRef}  trigger={<button><span
                                                                    className={`cursor-pointer text-[20px]`}><BiArchive></BiArchive></span>
                                                                </button>} position="bottom right">
                                                                    {close => (
                                                                        <div className={`px-2 py-2`}>
                                                                            <div className={`mb-4 text-sm text-red-500`}>Do you want to archive
                                                                                this project?
                                                                            </div>
                                                                            <div className={`flex justify-end items-center`}>
                                                                                <button
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>No
                                                                                </button>
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(project._id)}>Yes</button>
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
                                                                                this project?
                                                                            </div>
                                                                            <div className={`flex justify-end items-center`}>
                                                                                <button
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>No
                                                                                </button>
                                                                                <button className={`btn-black btn-sm max-w-12 ${loadingAction ? 'btn-loading' : ''}`} onClick={() => manageStatus(project._id)}>Yes</button>
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
                                                                            this project?
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
                                                    )
                                                }

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
            ) :  projects.length === 0 && !loading ? (
                <NoDataFound title={`No Project Found`}
                             subtitle={`Please click "New Project" button to create a new project`}/>
            ) : (
                <Loader />
            )
            }
        </>
    );
};

export default Project;