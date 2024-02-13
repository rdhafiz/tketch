import React, {useEffect, useRef, useState} from 'react';
import TwoLetterName from "../components/TwoLetterName.jsx";
import Popup from "reactjs-popup";
import Select from "react-select";
import {Link, useParams} from "react-router-dom";
import {
    BiEditAlt, BiSolidBadgeCheck,
    BiSolidCog, BiTrash,
} from "react-icons/bi";
import NoDataFound from "../components/NoDataFound.jsx";
import Loader from "../components/Loader.jsx";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import useStore from "../../store/store.js";
import { Editor } from '@tinymce/tinymce-react';
import AuthService from "../../services/AuthService.js";
import {toast} from "react-toastify";

const TaskSingle = () => {
    const {user} = useStore();
    const [project, setProject] = useState(null);
    const [edit, setEdit] = useState({
        name: false,
        description: false,
        comment: false,
        commentEdit: false,
    });
    const [loading, setLoading] = useState({
        name: false,
        description: false,
        comment: false,
        label: false,
        labelDelete: false,
        state: false,
        stateDelete: false,
        attachment: false,
    });
    const [task, setTask] = useState(null);
    const [taskDescription, setTaskDescription] = useState('');
    const [comment, setComment] = useState('');
    const {id, taskId} = useParams();
    const popupRef = useRef();
    const popupRefNested = useRef();
    const [labels, setLabels] = useState([]);
    const [labelData, setLabelData] = useState({});
    const [states, setStates] = useState([]);
    const [stateData, setStateData] = useState({});
    const [commentEditData, setCommentEditData] = useState(null);
    const editorConfig = {
        height: '300',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | ' +
            'bold italic underline strikethrough | link image media table | align lineheight | ' +
            'numlist bullist indent outdent | emoticons charmap | removeformat',
        menubar: false,
        paste_data_images: true,
        file_picker_types: 'image',
        image_title: false,
        image_description: false,
        image_dimensions: false,
        image_uploadtab: false,
        file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e) => {
                // @ts-ignore
                const file = e.target.files[0];

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    /*
                      Note: Now we need to register the blob in TinyMCEs image blob
                      registry. In the next release this part hopefully won't be
                      necessary, as we are looking to handle it internally.
                    */
                    const id = 'blobid' + (new Date()).getTime();
                    const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                    // @ts-ignore
                    const base64 = reader.result.split(',')[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo.blobUri());
                });
                reader.readAsDataURL(file);
            });

            input.click();
        },
    }
    const editorKey = '5okkk6pa2e28eipboxtb3q4hpofm9drb2hm8i9jqydhlhrwh'
    useEffect(() => {
        getProject()
        getTask()
    }, [])
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));
    }, [labels, states])
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
    const getLabel = (keyword = '') => {
        ApiService.GET(ApiRoutes.label+'/'+ id +'?keyword=' + keyword,(res) => {
            if (res.status === 'ok') {
                setLabels( res.data)
            }
        })
    }
    const handleSearchLabel = (e) => {
        let keyword = e.target.value
        const timeoutId = setTimeout(() => {
            getLabel(keyword);
        }, 800);
        return () => clearTimeout(timeoutId);
    }
    const handleSubmitLabel = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, label: true})))
        let label  = {
            name: e.target.name.value,
            color: e.target.color.value,
            description: e.target.description.value,
            project_id: id,
        }
        ApiService.POST(ApiRoutes.label, label, (res) => {
            setLoading((prevState => ({...prevState, label: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getLabel()
            }
        })
    }
    const handleUpdateLabel = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, label: true})))
        let label  = {
            name: e.target.name.value,
            color: e.target.color.value,
            description: e.target.description.value,
            project_id: id,
        }
        ApiService.PATCH(ApiRoutes.label + '/' + labelData._id, label, (res) => {
            setLoading((prevState => ({...prevState, label: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getLabel()
            }
        })
    }
    const deleteLabel = (id) => {
        setLoading((prevState => ({...prevState, labelDelete: true})))
        ApiService.DELETE(ApiRoutes.label + '/' + id, (res) => {
            setLoading((prevState => ({...prevState, labelDelete: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getLabel()
            }
        })
    }
    const getState = (keyword = '') => {
        ApiService.GET(ApiRoutes.state+'/'+ id +'?keyword=' + keyword,(res) => {
            if (res.status === 'ok') {
                setStates(res.data)
            }
        })
    }
    const handleSearchState = (e) => {
        let keyword = e.target.value
        const timeoutId = setTimeout(() => {
            getState(keyword);
        }, 800);
        return () => clearTimeout(timeoutId);
    }
    const handleSubmitState = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, state: true})))
        let state  = {
            name: e.target.name.value,
            project_id: id,
        }
        ApiService.POST(ApiRoutes.state, state, (res) => {
            setLoading((prevState => ({...prevState, state: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getState()
            }
        })
    }
    const handleUpdateState = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, state: true})))
        let state  = {
            name: e.target.name.value,
            project_id: id,
        }
        ApiService.PATCH(ApiRoutes.state + '/' + stateData._id, state, (res) => {
            setLoading((prevState => ({...prevState, state: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getState()
            }
        })
    }
    const deleteState = (id) => {
        setLoading((prevState => ({...prevState, stateDelete: true})))
        ApiService.DELETE(ApiRoutes.state + '/' + id, (res) => {
            setLoading((prevState => ({...prevState, stateDelete: false})))
            if (res.status === 'ok') {
                popupRefNested.current.close()
                getState()
            }
        })
    }
    const handleName = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, name: true})))
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/name', {name: e.target.name.value}, (res) => {
            setLoading((prevState => ({...prevState, name: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({...prevState, name: e.target.name.value})))
                setEdit((prevState => ({...prevState, name: false})))
            }
        })
    }
    const handleDescription = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, description: true})))
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/desc', {description: taskDescription}, (res) => {
            setLoading((prevState => ({...prevState, description: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({...prevState, description: taskDescription})))
                setEdit((prevState => ({...prevState, description: false})))
            }
        })
    }
    const handleComment = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, comment: true})))
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/comment', {comment: comment}, (res) => {
            setLoading((prevState => ({...prevState, comment: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({...prevState, comments: res.comments})))
                setEdit((prevState => ({...prevState, comment: false})))
            }
        })
    }
    const handleCommentEdit = (e) => {
        e.preventDefault()
        setLoading((prevState => ({...prevState, comment: true})))
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/comment/' + commentEditData._id, {comment: commentEditData.comment}, (res) => {
            setLoading((prevState => ({...prevState, comment: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({...prevState, comments: res.comments})))
                setEdit((prevState => ({...prevState, commentEdit: false})))
                setCommentEditData(null)
            }
        })
    }
    const deleteComment = (commentId) => {
        setLoading((prevState => ({...prevState, comment: true})))
        ApiService.DELETE(ApiRoutes.task + '/' + taskId + '/comment/' + commentId, (res) => {
            setLoading((prevState => ({...prevState, comment: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({...prevState, comments: res.comments})))
                popupRef.current.close()
            }
        })
    }
    const handleAssignee = (member_id) => {
        let members = [...task.assignee]
        let existIndex = members.indexOf(member_id);
        if (existIndex > -1) {
            members.splice(existIndex, 1)
        } else {
            members.push(member_id)
        }
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/manage/assignee', {assignee: members}, (res) => {
            if (res.status === 'ok') {
                let modifiedMembers = project.members.filter(member => {
                    if (members.indexOf(member._id) > - 1) {
                        return member;
                    }
                })
                setTask((prevState => ({
                    ...prevState,
                    assignee: members,
                    members: modifiedMembers
                })))
            }
        })
    }
    const handleLabel = (label_id) => {
        let labelsIds = [...task.label_id]
        let existIndex = labelsIds.indexOf(label_id);
        if (existIndex > -1) {
            labelsIds.splice(existIndex, 1)
        } else {
            labelsIds.push(label_id)
        }
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/manage/label', {labels: labelsIds}, (res) => {
            if (res.status === 'ok') {
                let modifiedLabels = labels.filter(label => {
                    if (labelsIds.indexOf(label._id) > - 1) {
                        return label;
                    }
                })
                setTask((prevState => ({
                    ...prevState,
                    label_id: labelsIds,
                    label: modifiedLabels
                })))
            }
        })
    }
    const handleState = (state_id) => {
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/manage/state', {state_id: state_id}, (res) => {
            if (res.status === 'ok') {
                states.map(state => {
                    if (state._id == state_id) {
                        setTask((prevState => ({
                            ...prevState,
                            state: state,
                        })))
                    }
                })
                setTask((prevState => ({
                    ...prevState,
                    state_id: state_id,
                })))
            }
        })
    }
    const handleStatus = (status) => {
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/update/status', {status: status}, (res) => {
            if (res.status === 'ok') {
                popupRef.current.close()
                setTask((prevState => ({
                    ...prevState,
                    status: status,
                })))
            }
        })
    }
    const handlePriority = (priority) => {
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/update/priority', {priority: priority}, (res) => {
            if (res.status === 'ok') {
                popupRef.current.close()
                setTask((prevState => ({
                    ...prevState,
                    priority: priority,
                })))
            }
        })
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
    const handleSubmitAttachment = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', event.target.files[0])
        setLoading((prevLoading) => ({
            ...prevLoading,
            attachment: true,
        }));
        ApiService.PATCH_FORMDATA(ApiRoutes.task + '/' + taskId + '/add/attachment', formData, (res) => {
            setLoading((prevLoading) => ({
                ...prevLoading,
                attachment: false,
            }));
            if (res.status === 'ok') {
                setTask((prevState => ({
                    ...prevState,
                    attachment: res.attachments,
                })))
                popupRef.current.close();
            }
        })
    }
    const deleteAttachment = (file_id) => {
        setLoading((prevState => ({...prevState, attachment: true})))
        ApiService.DELETE(ApiRoutes.task + '/' + taskId + '/delete/attachment/' + file_id, (res) => {
            setLoading((prevState => ({...prevState, attachment: false})))
            if (res.status === 'ok') {
                setTask((prevState => ({
                    ...prevState,
                    attachment: res.attachments,
                })))
                popupRefNested.current.close()
            }
        })
    }
    const updateDueDate = (event) => {
        let date = event.target.value;
        if (!date) {
            date = null
        }
        console.log(date)
        ApiService.PATCH(ApiRoutes.task + '/' + taskId + '/due/date', {date}, (res) => {
            if (res.status === 'ok') {
                setTask((prevState => ({
                    ...prevState,
                    due_at: res.due_at,
                })))
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
            {task != null && (
                <div className={`flex h-[83vh] overflow-auto bg-gray-100 p-4 rounded-md`}>
                    <div id={`detail-section`} className={`w-2/3 pe-4`}>
                        <div className={`p-4 bg-white rounded-md h-[80vh] overflow-auto`}>
                            <div className={`min-h-[350px] overflow-auto mb-3`}>
                                <div className={`mb-1 flex items-center justify-between text-gray-500`}>
                                    Title
                                    {!edit.name && (
                                        <button className={`btn-white !py-1`} onClick={() => setEdit((prevState => ({...prevState, name: true})))}>Edit</button>
                                    )}
                                </div>
                                {edit.name ? (
                                    <form onSubmit={handleName}>
                                        <div className={`form-input`}>
                                            <input type="text" defaultValue={task.name} className={`input`} name={`name`}/>
                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                        </div>
                                        <div className="flex items-center justify-end pt-3 mb-6">
                                            <button type={`button`} onClick={() => setEdit((prevState => ({...prevState, name: false})))}
                                                  className="btn-white mr-3">Cancel</button>
                                            <button type={`submit`} className={`btn-black !w-[100px] ${loading.name ? 'btn-loading' : ''}`}>
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={`font-bold text-2xl mb-4`}>{task?.name} <span className={`text-gray-500`}># {task.number}</span></div>
                                )}
                                <div className={`mb-1 flex items-center justify-between text-gray-500`}>
                                    Description
                                    {!edit.description && (
                                        <button className={`btn-white !py-1`} onClick={() => setEdit((prevState => ({...prevState, description: true})))}>Edit</button>
                                    )}
                                </div>
                                {edit.description ? (
                                    <form onSubmit={handleDescription}>
                                        <div className={`form-input`}>
                                            <Editor
                                                apiKey={editorKey}
                                                init={{
                                                    plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                                                    toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                                                        'bold italic underline strikethrough | link image media table | align lineheight | ' +
                                                        'numlist bullist indent outdent | emoticons charmap | removeformat',
                                                    paste_data_images: true,
                                                    file_picker_types: 'image',
                                                    image_title: false,
                                                    image_description: false,
                                                    image_dimensions: false,
                                                    image_uploadtab: false,
                                                    file_picker_callback: (cb, value, meta) => {
                                                        const input = document.createElement('input');
                                                        input.setAttribute('type', 'file');
                                                        input.setAttribute('accept', 'image/*');

                                                        input.addEventListener('change', (e) => {
                                                            // @ts-ignore
                                                            const file = e.target.files[0];

                                                            const reader = new FileReader();
                                                            reader.addEventListener('load', () => {
                                                                /*
                                                                  Note: Now we need to register the blob in TinyMCEs image blob
                                                                  registry. In the next release this part hopefully won't be
                                                                  necessary, as we are looking to handle it internally.
                                                                */
                                                                const id = 'blobid' + (new Date()).getTime();
                                                                const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                                                // @ts-ignore
                                                                const base64 = reader.result.split(',')[1];
                                                                const blobInfo = blobCache.create(id, file, base64);
                                                                blobCache.add(blobInfo);

                                                                /* call the callback and populate the Title field with the file name */
                                                                cb(blobInfo.blobUri());
                                                            });
                                                            reader.readAsDataURL(file);
                                                        });

                                                        input.click();
                                                    },
                                                }}
                                                initialValue={task.description}
                                                onEditorChange={(content) => setTaskDescription(content)}
                                            />
                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                        </div>
                                        <div className="flex items-center justify-end pt-3 mb-6">
                                            <button type={`button`} onClick={() => setEdit((prevState => ({...prevState, description: false})))}
                                                    className="btn-white mr-3">Cancel</button>
                                            <button type={`submit`} className={`btn-black !w-[100px] ${loading.description ? 'btn-loading' : ''}`}>
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className={``} dangerouslySetInnerHTML={{__html: task?.description}}></div>
                                )}

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
                                {edit.comment ? (
                                    <form onSubmit={handleComment} className={`w-full`}>
                                        <div className={`form-input`}>
                                            <input type="hidden" name={`comment`}/>
                                            <Editor
                                                apiKey={editorKey}
                                                init={editorConfig}
                                                initialValue={''}
                                                onEditorChange={(content) => setComment(content)}
                                            />
                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                        </div>
                                        <div className="flex items-center justify-end pt-3 mb-6">
                                            <button type={`button`} onClick={() => {
                                                setEdit((prevState => ({...prevState, comment: false})))
                                                setComment('')
                                            }}
                                                    className="btn-white mr-3">Cancel</button>
                                            <button type={`submit`} className={`btn-black !w-[100px] ${loading.comment ? 'btn-loading' : ''}`}>
                                                Save
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-1 w-full hover:bg-gray-100" onClick={() => setEdit((prevState => ({...prevState, comment: true})))}>
                                        <div className={`px-3 py-2 border-[1px] rounded-md cursor-text`}>Add a comment</div>
                                    </div>
                                )}

                            </div>
                            {task.comments.length > 0 && (
                                <>
                                    {task.comments.map(comment => {
                                        return (
                                            <div className="flex items-start space-x-4 mb-5" key={comment._id}>
                                                {comment?.user_details?.avatarFullPath ? (
                                                    <span className="block h-9 w-9 flex-shrink-0 rounded-full">
                                                        <img className={`rounded-full`} src={comment?.user_details?.avatarFullPath} alt=""/>
                                                    </span>
                                                ) : (
                                                    <span className={`flex items-center justify-center h-9 w-9 flex-shrink-0 rounded-full bg-cyan-500`}>
                                                        <TwoLetterName classes={`font-normal`} name={comment?.user_details?.name}/>
                                                    </span>
                                                )}
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold">
                                                        {comment?.user_details?.name}
                                                        <time className="ms-5 text-sm font-medium" >{comment.comment_time}</time>
                                                    </h4>
                                                    {
                                                        edit.commentEdit && comment._id == commentEditData._id ? (
                                                                <form onSubmit={handleCommentEdit} className={`w-full`}>
                                                                    <div className={`form-input`}>
                                                                        <input type="hidden" name={`comment`}/>
                                                                        <Editor
                                                                            apiKey={editorKey}
                                                                            init={editorConfig}
                                                                            initialValue={comment.comment}
                                                                            onEditorChange={(content) => setCommentEditData((prevState) =>({
                                                                                ...prevState, comment: content,
                                                                            }))}
                                                                        />
                                                                        <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                    </div>
                                                                    <div className="flex items-center justify-end pt-3 mb-6">
                                                                        <button type={`button`} onClick={() => {
                                                                            setEdit((prevState => ({...prevState, commentEdit: false})))
                                                                            setCommentEditData(null)
                                                                        }} className="btn-white mr-3">Cancel</button>
                                                                        <button type={`submit`} className={`btn-black !w-[100px] ${loading.comment ? 'btn-loading' : ''}`}>
                                                                            Save
                                                                        </button>
                                                                    </div>
                                                                </form>
                                                        ) : (
                                                            <div dangerouslySetInnerHTML={{__html: comment.comment}}></div>
                                                        )
                                                    }

                                                    {user._id == comment.user_id && !edit.commentEdit && (
                                                        <div>
                                                            <button className={`text-sm font-medium text-gray-500 me-2 mt-3`} onClick={() => {
                                                                setEdit((prevState) =>({...prevState, commentEdit: true}));
                                                                setCommentEditData(comment)
                                                            }}>Edit</button>
                                                            <Popup offsetX={0} ref={popupRef} trigger={  <button className={`text-sm font-medium text-gray-500 !py-1`}>Delete
                                                            </button>} position={["bottom right"]}>
                                                                {close => (
                                                                    <div className={`px-2 py-2`}>
                                                                        <div className={`mb-4 text-sm text-red-500`}>Do you want to delete
                                                                            this comment?
                                                                        </div>
                                                                        <div className={`flex justify-end items-center`}>
                                                                            <button
                                                                                className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                onClick={close}>No
                                                                            </button>
                                                                            <button className={`btn-black btn-sm max-w-12 ${loading.comment ? 'btn-loading' : ''}`} onClick={() => deleteComment(comment._id)}>Yes</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Popup>

                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    </div>
                    <div id={`info-section`} className={`w-1/3 `}>
                        <div className={`p-3 bg-white border-[1px] h-[80vh] overflow-auto rounded-md`}>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Status</div>
                                </div>
                                {task.status != null ? (
                                        <Popup ref={popupRef}  trigger={ <div className={`capitalize 
                                        px-2 py-1 flex items-center w-36 mb-4 justify-center rounded-md  text-white
                                        ${task.status === 'archived' ? 'bg-gray-600' : task.status === 'active' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                            {task.status}
                                        </div>} arrow={false}
                                                position={"bottom center"}>
                                            {close => (
                                                <div className={`px-2 py-2 w-36 max-w-72`}>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handleStatus('active')}>
                                                        Active
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handleStatus('archived')}>
                                                        Archived
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handleStatus('completed')}>
                                                        Completed
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                ) : (
                                    <div className={`text-gray-500 mb-4`}>No status has been set yet</div>
                                )}
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Priority</div>
                                </div>
                                {task.priority != null ? (
                                        <Popup ref={popupRef}  trigger={ <div className={`capitalize px-2 py-1 flex items-center w-36 mb-4 border-white border-[1px] hover:border-gray-300 active:border-gray-300 rounded-md`}>
                                            <img className={`w-[20px] me-2`} src={getIconOfPriority(task.priority)} alt=""/>
                                            {task.priority}
                                        </div>} arrow={false}
                                              position={"bottom center"}>
                                            {close => (
                                                <div className={`px-2 py-2 w-36 max-w-72`}>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handlePriority('highest')}>
                                                        <img className={`w-[20px] me-2`} src={getIconOfPriority('highest')} alt=""/>
                                                        Highest
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handlePriority('high')}>
                                                        <img className={`w-[20px] me-2`} src={getIconOfPriority('high')} alt=""/>
                                                        High
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handlePriority('medium')}>
                                                        <img className={`w-[20px] me-2`} src={getIconOfPriority('medium')} alt=""/>
                                                        Medium
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`} onClick={() => handlePriority('low')}>
                                                        <img className={`w-[20px] me-2`} src={getIconOfPriority('low')} alt=""/>
                                                        Low
                                                    </div>
                                                    <div className={`capitalize flex items-center mb-3 cursor-pointer`}onClick={() => handlePriority('lowest')}>
                                                        <img className={`w-[20px] me-2`} src={getIconOfPriority('lowest')} alt=""/>
                                                        Lowest
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                ) : (
                                    <div className={`text-gray-500 mb-4`}>No status has been set yet</div>
                                )}
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Assignee</div>
                                    <div className={``}>
                                        <Popup ref={popupRef}  trigger={<i className={`cursor-pointer text-gray-400 text-2xl`}><BiSolidCog /></i>} position="bottom right">
                                            {close => (
                                                <div className={`px-2 py-2 w-auto min-w-72 max-h-96 overflow-auto`}>
                                                    {
                                                        project.members.map((member) => {
                                                            return (
                                                               <div key={member._id} className={`flex items-center mb-3 cursor-pointer`} onClick={() => handleAssignee(member._id)}>
                                                                   <div className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 me-3`} >
                                                                       {member?.avatarFullPath ? (
                                                                           <img className={`cursor-pointer rounded-full`} src={member.avatarFullPath} alt=""/>
                                                                       ) : (
                                                                           <span className={`cursor-pointer flex h-full w-full items-center justify-center rounded-full ${member?.color}`}>
                                                                                <TwoLetterName classes={`font-normal`} name={member.name}/>
                                                                           </span>
                                                                       )}
                                                                   </div>
                                                                   <div className={`me-4`}> {member.name}</div>
                                                                   {
                                                                       task.assignee.indexOf(member._id) > -1 && (
                                                                           <div><BiSolidBadgeCheck /></div>
                                                                       )
                                                                   }
                                                               </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )}
                                        </Popup>
                                    </div>
                                </div>
                                <div className={`flex items-center mb-4`}>
                                    {task.members.length > 0 ? (
                                        task?.members.map((member) => {
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
                                        ) : (
                                            <div className={`text-gray-500`}>Unassigned</div>
                                    )}
                                </div>
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Reporter</div>
                                    <div></div>
                                </div>
                                <div className={`flex items-center mb-4`}>
                                    <div className={`relative flex shrink-0 rounded-full h-8 w-8 overflow-visible border-2 first:ms-0  me-1 `} >
                                        {task?.reporter.avatarFullPath ? (
                                            <img className={`cursor-pointer rounded-full`} src={task?.reporter.avatarFullPath} alt=""/>
                                        ) : (
                                            <span className={`cursor-pointer flex h-full w-full items-center justify-center rounded-full ${task?.reporter?.color}`}>
                                                                <TwoLetterName classes={`font-normal`} name={task?.reporter.name}/>
                                                            </span>
                                        )}
                                    </div>
                                    <div>{task?.reporter?.name}</div>
                                </div>
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Labels</div>
                                    <div>
                                        <Popup ref={popupRef} nested trigger={<span><i onClick={() => getLabel()} className={`cursor-pointer text-gray-400 text-2xl`}><BiSolidCog /></i></span>}
                                               keepTooltipInside=".h-screen" position={['left center']}>
                                            {close => (
                                                <>
                                                    <div className={`flex justify-between items-center mb-3 mt-3 px-3`}>
                                                        <input onChange={(e) => handleSearchLabel(e)} type="text" className={`input max-w-48`} placeholder={`Search..`}/>
                                                        <Popup offsetX={15} ref={popupRefNested}  trigger={ <button className={`btn-black !w-12 justify-center`}>New</button>}
                                                               keepTooltipInside=".h-screen" position={['left center']}>
                                                            {close => (
                                                                <div className={`px-2 py-2 max-w-72`}>
                                                                    <form onSubmit={handleSubmitLabel}>
                                                                        <div className="space-y-2 form-input mb-3">
                                                                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                                                                Name
                                                                            </label>
                                                                            <input type={`text`} className="input" id="name" name={`name`}
                                                                            />
                                                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                        </div>
                                                                        <div className="space-y-2 form-input mb-3">
                                                                            <label className="text-sm font-medium leading-none" htmlFor="description">
                                                                                Short Description
                                                                            </label>
                                                                            <input type={`text`} className="input" id="description" name={`description`}
                                                                            />
                                                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                        </div>
                                                                        <div className="space-y-2 form-input mb-3">
                                                                            <label className="text-sm font-medium leading-none" htmlFor="color">
                                                                                Color
                                                                            </label>
                                                                            <input type={`color`} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="color" name={`color`}
                                                                            />
                                                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                        </div>

                                                                        <div className={`flex justify-end items-center mt-3`}>
                                                                            <button type={`button`}
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>Close
                                                                            </button>
                                                                            <button type={`submit`} className={`btn-black btn-sm max-w-12 ${loading.label ? 'btn-loading' : ''}`}>Save</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            )}
                                                        </Popup>

                                                    </div>
                                                    <div className={`px-2 py-2 w-auto min-w-72 max-h-96 overflow-auto`}>
                                                        {labels.length > 0 ? (
                                                            <>
                                                                {
                                                                    labels.map(label => {
                                                                        return (
                                                                            <div className={`flex items-center justify-between border-b-[1px]  pb-3 mb-2`} key={label._id}>
                                                                                <div className={`flex items-center cursor-pointer`} onClick={() => handleLabel(label._id)}>
                                                                                    <div className={`w-3 h-3 rounded-full me-2`} style={{backgroundColor: label.color}}></div>
                                                                                    <div className={`me-4`}>
                                                                                        <div>{label.name}</div>
                                                                                        <div className={`text-gray-500 text-[11px]`}>{label.description}</div>
                                                                                    </div>
                                                                                    {task.label_id.indexOf(label._id) > -1 && (
                                                                                        <div><BiSolidBadgeCheck /></div>
                                                                                    )
                                                                                    }
                                                                                </div>
                                                                                <div className={`flex items-center justify-between w-10`}>
                                                                                    <Popup offsetX={0} ref={popupRefNested} trigger={<button><span onClick={() => setLabelData(label)}
                                                                                                                                                   className={`cursor-pointer`}><BiEditAlt></BiEditAlt></span>
                                                                                    </button>} keepTooltipInside=".h-screen" position={['top center', 'bottom right', 'bottom left']}>
                                                                                        {close => (
                                                                                            <div className={`px-2 py-2 max-w-72`}>
                                                                                                <form onSubmit={handleUpdateLabel}>
                                                                                                    <div className="space-y-2 form-input mb-3">
                                                                                                        <label className="text-sm font-medium leading-none" htmlFor="name">
                                                                                                            Name
                                                                                                        </label>
                                                                                                        <input defaultValue={labelData.name} type={`text`} className="input" id="name" name={`name`}
                                                                                                        />
                                                                                                        <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                                                    </div>
                                                                                                    <div className="space-y-2 form-input mb-3">
                                                                                                        <label className="text-sm font-medium leading-none" htmlFor="description">
                                                                                                            Short Description
                                                                                                        </label>
                                                                                                        <input defaultValue={labelData.description} type={`text`} className="input" id="description" name={`description`}
                                                                                                        />
                                                                                                        <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                                                    </div>
                                                                                                    <div className="space-y-2 form-input mb-3">
                                                                                                        <label className="text-sm font-medium leading-none" htmlFor="color">
                                                                                                            Color
                                                                                                        </label>
                                                                                                        <input defaultValue={labelData.color} type={`color`} className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700" id="color" name={`color`}
                                                                                                        />
                                                                                                        <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                                                    </div>

                                                                                                    <div className={`flex justify-end items-center mt-3`}>
                                                                                                        <button type={`button`}
                                                                                                                className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                                                onClick={close}>Close
                                                                                                        </button>
                                                                                                        <button type={`submit`} className={`btn-black btn-sm max-w-12 ${loading.label ? 'btn-loading' : ''}`}>Save</button>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>
                                                                                        )}
                                                                                    </Popup>
                                                                                    <Popup offsetX={0} ref={popupRefNested} trigger={<button><span
                                                                                        className={`cursor-pointer`}><BiTrash></BiTrash></span>
                                                                                    </button>} keepTooltipInside=".h-screen" position={["bottom right"]}>
                                                                                        {close => (
                                                                                            <div className={`px-2 py-2`}>
                                                                                                <div className={`mb-4 text-sm text-red-500`}>Do you want to delete
                                                                                                    this label?
                                                                                                </div>
                                                                                                <div className={`flex justify-end items-center`}>
                                                                                                    <button
                                                                                                        className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                                        onClick={close}>No
                                                                                                    </button>
                                                                                                    <button className={`btn-black btn-sm max-w-12 ${loading.labelDelete ? 'btn-loading' : ''}`} onClick={() => deleteLabel(label._id)}>Yes</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </Popup>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        ) : (
                                                            <div className={`text-center text-gray-500`}>No label found please add new</div>
                                                        )}
                                                    </div>
                                                </>

                                            )}
                                        </Popup>
                                    </div>
                                </div>
                                {task.label.length > 0 ? (
                                    <div className={`flex items-center me-16 flex-wrap mb-4`}>
                                        {task.label.map(l => {
                                            return (
                                                <div key={l._id}>
                                                    {l.description ? (
                                                        <Popup className={`w-auto`}
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
                                                        <div style={{backgroundColor: l.color}} className={`p-1 mb-1 leading-3 rounded-full font-bold text-white me-2 text-[11px]`}>{l.name}</div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className={`text-gray-500 mb-4`}>No label has been set yet</div>
                                )}
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>State</div>
                                    <div>
                                        <Popup ref={popupRef} nested trigger={<span><i onClick={() => getState()} className={`cursor-pointer text-gray-400 text-2xl`}><BiSolidCog /></i></span>}
                                               keepTooltipInside=".h-screen" position={['left center']}>
                                            {close => (
                                                <>
                                                    <div className={`flex justify-between items-center mb-3 mt-3 px-3`}>
                                                        <input onChange={(e) => handleSearchState(e)} type="text" className={`input max-w-48`} placeholder={`Search..`}/>
                                                        <Popup offsetX={15} ref={popupRefNested}  trigger={ <button className={`btn-black !w-12 justify-center`}>New</button>}
                                                               keepTooltipInside=".h-screen" position={['bottom right']}>
                                                            {close => (
                                                                <div className={`px-2 py-2 max-w-72`}>
                                                                    <form onSubmit={handleSubmitState}>
                                                                        <div className="space-y-2 form-input mb-3">
                                                                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                                                                Name
                                                                            </label>
                                                                            <input type={`text`} className="input" id="name" name={`name`}
                                                                            />
                                                                            <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                        </div>

                                                                        <div className={`flex justify-end items-center mt-3`}>
                                                                            <button type={`button`}
                                                                                    className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                    onClick={close}>Close
                                                                            </button>
                                                                            <button type={`submit`} className={`btn-black btn-sm max-w-12 ${loading.state ? 'btn-loading' : ''}`}>Save</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            )}
                                                        </Popup>

                                                    </div>
                                                    <div className={`px-2 py-2 w-auto min-w-72 max-h-96 overflow-auto`}>
                                                        {states.length > 0 ? (
                                                            <>
                                                                {
                                                                    states.map(state => {
                                                                        return (
                                                                            <div className={`flex items-center justify-between border-b-[1px]  pb-3 mb-2`} key={state._id}>
                                                                                <div className={`flex items-center cursor-pointer`} onClick={() => handleState(state._id)}>
                                                                                    <div className={`me-4`}>{state.name}</div>
                                                                                    {task.state_id === state._id && (
                                                                                        <div><BiSolidBadgeCheck /></div>
                                                                                    )
                                                                                    }
                                                                                </div>
                                                                                <div className={`flex items-center justify-between w-10`}>
                                                                                    <Popup offsetX={0} ref={popupRefNested} trigger={<button><span onClick={() => setStateData(state)}
                                                                                                                                                   className={`cursor-pointer`}><BiEditAlt></BiEditAlt></span>
                                                                                    </button>} keepTooltipInside=".h-screen" position={['top center', 'bottom right', 'bottom left']}>
                                                                                        {close => (
                                                                                            <div className={`px-2 py-2 max-w-72`}>
                                                                                                <form onSubmit={handleUpdateState}>
                                                                                                    <div className="space-y-2 form-input mb-3">
                                                                                                        <label className="text-sm font-medium leading-none" htmlFor="name">
                                                                                                            Name
                                                                                                        </label>
                                                                                                        <input defaultValue={stateData.name} type={`text`} className="input" id="name" name={`name`}
                                                                                                        />
                                                                                                        <small className="text-red-500 text-sm invalid-feedback"></small>
                                                                                                    </div>

                                                                                                    <div className={`flex justify-end items-center mt-3`}>
                                                                                                        <button type={`button`}
                                                                                                                className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                                                onClick={close}>Close
                                                                                                        </button>
                                                                                                        <button type={`submit`} className={`btn-black btn-sm max-w-12 ${loading.state ? 'btn-loading' : ''}`}>Save</button>
                                                                                                    </div>
                                                                                                </form>
                                                                                            </div>
                                                                                        )}
                                                                                    </Popup>
                                                                                    <Popup offsetX={0} ref={popupRefNested} trigger={<button><span
                                                                                        className={`cursor-pointer`}><BiTrash></BiTrash></span>
                                                                                    </button>} keepTooltipInside=".h-screen" position={["bottom right"]}>
                                                                                        {close => (
                                                                                            <div className={`px-2 py-2`}>
                                                                                                <div className={`mb-4 text-sm text-red-500`}>Do you want to delete
                                                                                                    this state?
                                                                                                </div>
                                                                                                <div className={`flex justify-end items-center`}>
                                                                                                    <button
                                                                                                        className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                                        onClick={close}>No
                                                                                                    </button>
                                                                                                    <button className={`btn-black btn-sm max-w-12 ${loading.stateDelete ? 'btn-loading' : ''}`} onClick={() => deleteState(state._id)}>Yes</button>
                                                                                                </div>
                                                                                            </div>
                                                                                        )}
                                                                                    </Popup>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        ) : (
                                                            <div className={`text-center text-gray-500`}>No state found please add new</div>
                                                        )}

                                                    </div>
                                                </>

                                            )}
                                        </Popup>
                                    </div>
                                </div>
                                {task.state != null ? (
                                    <div className={`capitalize border font-bold p-2 w-max rounded-md text-[12px] flex items-center mb-4`}>{task.state.name}</div>
                                ) : (
                                    <div className={`text-gray-500 mb-4`}>No state has been set yet</div>
                                )}
                            </div>
                            <div className={`border-b-[1px] mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Due date</div>
                                    <div></div>
                                </div>
                                <div className={`flex items-center mb-4`}>
                                    <input type="date" className={`input`} defaultValue={task.formattedDate}  onChange={(event) => updateDueDate(event)}/>
                                </div>
                            </div>
                            <div className={`mb-5`}>
                                <div className={`flex items-center justify-between mb-2`}>
                                    <div className={`text-[16px] font-medium text-teal-900`}>Attachments</div>
                                    <div>
                                        <Popup ref={popupRef} nested trigger={<span><i className={`cursor-pointer text-gray-400 text-2xl`}><BiSolidCog /></i></span>}
                                               keepTooltipInside=".h-screen" position={['left center']}>
                                            {close => (
                                                <>
                                                    <div className="flex items-center space-x-4">
                                                        <div
                                                            className="border-2 border-dashed border-gray-200 rounded-lg w-full h-24 flex items-center justify-center p-4">
                                                            <input className="hidden" id="file-upload" type="file" onChange={(event) => handleSubmitAttachment(event)}/>
                                                            {loading.attachment ? (
                                                                <div className="h-6 w-6 border-2 border-gray-500 rounded-full animate-pulse"></div>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    width="24"
                                                                    height="24"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    className="w-6 h-6"
                                                                >
                                                                    <path
                                                                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                    <polyline points="17 8 12 3 7 8"></polyline>
                                                                    <line x1="12" x2="12" y1="3" y2="15"></line>
                                                                </svg>
                                                            )}
                                                            <label htmlFor="file-upload"
                                                                   className="cursor-pointer flex items-center space-x-2 ms-2">

                                                                <span className="text-sm font-medium text-gray-500">Click here to upload</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </>

                                            )}
                                        </Popup>
                                    </div>
                                </div>
                                {task?.attachment?.length > 0 ? (
                                    <>
                                        {
                                            task.attachment.map(file => {
                                                return(
                                                    <div className={`flex items-center justify-between`} key={file._id}>
                                                        <a className={`mb-3 text-cyan-600`} target={`_blank`} href={file.fileFullPath}>{file.file_name}</a>
                                                        <div>
                                                            <Popup offsetX={0} ref={popupRefNested} trigger={<button><span
                                                                className={`cursor-pointer`}><BiTrash></BiTrash></span>
                                                            </button>} keepTooltipInside=".h-screen" position={["bottom right"]}>
                                                                {close => (
                                                                    <div className={`px-2 py-2`}>
                                                                        <div className={`mb-4 text-sm text-red-500`}>Do you want to delete
                                                                            this attachment?
                                                                        </div>
                                                                        <div className={`flex justify-end items-center`}>
                                                                            <button
                                                                                className={`btn-white btn-sm me-2 min-w-12 justify-center`}
                                                                                onClick={close}>No
                                                                            </button>
                                                                            <button className={`btn-black btn-sm max-w-12 ${loading.attachment ? 'btn-loading' : ''}`} onClick={() => deleteAttachment(file._id)}>Yes</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Popup>
                                                        </div>
                                                    </div>
                                                )
                                            })

                                        }
                                    </>
                                ) : (
                                    <div className={`text-gray-500 mb-4`}>No attachment found</div>
                                )}
                            </div>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default TaskSingle;