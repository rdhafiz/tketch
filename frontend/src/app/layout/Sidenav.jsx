import React, {useEffect, useState} from 'react';
import useStore from "../../store/store.js";
import TwoLatterName from "../components/TwoLatterName.jsx";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";

const Sidenav = () => {
    const {project} = useStore();
    const [projects, setProjects] = useState([])
    const [isUseEffectRan, setIsUseEffectRan] = useState(false)
    const getProjects = (event) => {
        ApiService.GET(ApiRoutes.project + '?keyword=' + event.target.value, (res) => {
            if (res.status === 'ok') {
                setProjects(res.data.project)
            }
        })
    }
    useEffect(() => {
        console.log(isUseEffectRan)
        if (!isUseEffectRan) {
            setProjects(project);
            if (project.length > 0) setIsUseEffectRan(true)
        }
    }, [project])
    return (
        <aside className="w-80 bg-gray-100 border-r dark:bg-gray-900 dark:border-gray-800">
            <nav className="flex flex-col p-4 space-y-2">
                <a className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                    <input className={`input`} type="text" placeholder={`Search`} onChange={(event) => getProjects(event)}/>
                </a>
                {
                    projects != null && projects.length > 0 && (
                        <>
                            {
                                projects.map(project => {
                                    return (
                                        <a key={project._id} className="group flex mb-3 items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                                            {
                                                project.user.avatarFullPath ? (
                                                    <div className={`flex h-4 w-4 flex-shrink-0 rounded-full`}>
                                                        <img src={project.user.avatarFullPath} alt=""/>
                                                    </div>
                                                ) : (
                                                    <span className={`flex items-center justify-center h-4 w-4 flex-shrink-0 rounded-full ${project.user.color}`}>
                                                                            <TwoLatterName classes={`font-normal text-[10px]`} name={project.user.name}/>
                                                                        </span>
                                                )
                                            }
                                            <div className={`ms-1`}>{project.user.name}</div>/<div className={`text-cyan-600 group-hover:text-cyan-900`}>{project.name}</div>
                                        </a>
                                    )
                                })
                            }
                        </>

                    )
                }

            </nav>
        </aside>
    );
};

export default Sidenav;