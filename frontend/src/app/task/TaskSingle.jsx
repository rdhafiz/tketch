import React, {useEffect, useState} from 'react';
import TwoLetterName from "../components/TwoLetterName.jsx";
import Popup from "reactjs-popup";
import Select from "react-select";
import {Link, useParams} from "react-router-dom";
import {
    BiEditAlt,
    BiSolidCog,
} from "react-icons/bi";
import NoDataFound from "../components/NoDataFound.jsx";
import Loader from "../components/Loader.jsx";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import useStore from "../../store/store.js";

const TaskSingle = () => {
    const {user} = useStore();
    const [project, setProject] = useState(null);
    const [task, setTask] = useState(null);
    const {id, taskId} = useParams();
    useEffect(() => {
        getProject()
        getTask()
    }, [])
    const getProject = () => {
        ApiService.GET(ApiRoutes.project + '/' + id, (res) => {
            if (res.status === 'ok') {
                setProject(res.data)
            }
        })
    }
    const getTask = () => {
        ApiService.GET(ApiRoutes.task + '/single/' + taskId, (res) => {
            if (res.status === 'ok') {
                setTask(res.data)
            }
        })
    }
    return (
        <>
            {project != null && (
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
                                        <Popup  className={`w-auto`} key={member._id}
                                                trigger={open => (
                                                    <div className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 first:ms-0  ms-[-10px] hover:z-10 `} >
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
                </div>
            )}
            <div className={`flex h-[83vh] overflow-auto bg-gray-100 p-4 rounded-md`}>
                <div id={`detail-section`} className={`w-2/3 pe-4`}>
                    <div className={`p-4 bg-white rounded-md h-[80vh] overflow-auto`}>
                        <div className={`min-h-[350px] overflow-auto mb-3`}>
                            <div className={`mb-1 flex items-center justify-between text-gray-500`}>Title <button className={`btn-white !py-1`}>Edit</button></div>
                            <div className={`font-bold text-2xl mb-4`}>Lorem ipsum dolor sit amet, consectetur adipisicing elit  {task?.name}</div>
                            <div className={`mb-1 flex items-center justify-between text-gray-500`}>Description <button className={`btn-white !py-1`}>Edit</button></div>
                            <div className={``}>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius et magnam
                                reprehenderit tenetur voluptatum! Aliquid consequatur consequuntur est in ipsum, laborum,
                                molestias officiis quas rem, saepe sed similique. Aliquid, explicabo.
                                 {task?.description}
                            </div>
                        </div>
                        <div className={`font-bold mb-3`}>Comments</div>
                        <div className="flex items-start space-x-4 mb-8">
                            {user?.avatarFullPath ? (
                                <span className="block h-9 w-9 flex-shrink-0 rounded-full">
                                        <img className={`rounded-full`} src={user?.avatarFullPath} alt=""/>
                                    </span>
                            ) : (
                                <span className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-full bg-cyan-500`}>
                                        <TwoLetterName classes={`font-normal`} name={user?.name}/>
                                    </span>
                            )}
                            <div className="space-y-1 w-full">
                                <div className={`px-3 py-2 border-[1px] rounded-md cursor-text`}>Add a comment</div>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4 mb-8">
                            {project?.iconFullPath ? (
                                <span className="block h-9 w-9 flex-shrink-0 rounded-full">
                                        <img className={`rounded-full`} src={project.iconFullPath} alt=""/>
                                    </span>
                            ) : (
                                <span className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-full bg-cyan-500`}>
                                        <TwoLetterName classes={`font-normal`} name={'kamal'}/>
                                    </span>
                            )}
                            <div className="space-y-1">
                                <h4 className="font-semibold">
                                    Alice Johnson
                                    <time className="ms-5 text-sm font-medium" >2 hours ago</time>
                                </h4>
                                <p>I'm so excited to use the Shadcn Design Library in my next project! The components
                                    look amazing.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4 mb-8">
                            {project?.iconFullPath ? (
                                <span className="block h-9 w-9 flex-shrink-0 rounded-full">
                                        <img className={`rounded-full`} src={project.iconFullPath} alt=""/>
                                    </span>
                            ) : (
                                <span className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-full bg-cyan-500`}>
                                        <TwoLetterName classes={`font-normal`} name={'kamal'}/>
                                    </span>
                            )}
                            <div className="space-y-1">
                                <h4 className="font-semibold">
                                    Alice Johnson
                                    <time className="ms-5 text-sm font-medium" >2 hours ago</time>
                                </h4>
                                <p>I'm so excited to use the Shadcn Design Library in my next project! The components
                                    look amazing.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id={`info-section`} className={`w-1/3 `}>
                    <div className={`p-3 bg-white border-[1px] rounded-md`}>
                        <div className={`border-b-[1px] mb-5`}>
                            <div className={`flex items-center justify-between mb-2`}>
                                <div>Assignee</div>
                                <div><i><BiSolidCog /></i></div>
                            </div>
                            <div></div>
                        </div>
                        <div className={`border-b-[1px] mb-5`}>
                            <div className={`flex items-center justify-between mb-2`}>
                                <div>Reporter</div>
                                <div><i><BiSolidCog /></i></div>
                            </div>
                            <div></div>
                        </div>
                        <div className={`border-b-[1px] mb-5`}>
                            <div className={`flex items-center justify-between mb-2`}>
                                <div>Labels</div>
                                <div><i><BiSolidCog /></i></div>
                            </div>
                            <div></div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default TaskSingle;