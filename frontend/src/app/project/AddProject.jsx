import React, {useEffect, useState} from 'react';
import TwoLetterName from "../components/TwoLetterName.jsx";
import AsyncSelect from 'react-select/async'
import {Link, useNavigate} from "react-router-dom";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";

const AddProject = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([])
    const [searchTimeout, setSearchTimeout] = useState(null)
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        icon: '',
        icon_show: '',
        members_id: [],
    })
    const userName = (user) => {
        return (
            <div className={`flex items-center`}>
                <span className="relative flex shrink-0 rounded-full h-7 w-7 overflow-visible me-2">
                     {user.avatarFullPath ? (
                         <img src={user.avatarFullPath} onClick={() => handleDropDown()} alt=""/>
                     ) : (
                         <span
                             className="flex h-full w-full items-center justify-center rounded-full bg-cyan-500"><TwoLetterName
                             name={user.name} classes={``}/></span>
                     )}
                </span>
                <span>{user.name}</span>
            </div>
        )
    }
    const getUser = (keyword = '', callback) => {
        ApiService.GET(ApiRoutes.user + '?keyword=' + keyword, (res) => {
            if (res.status === 'ok') {
                let userOption = []
                res.data.map((v) => {
                    userOption.push({value: v._id, label: userName(v)})
                })
                setUsers(userOption)
                if (callback) {
                    callback(userOption)
                }
            }
        })
    }
    const loadUser = (inputValue, callback) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout)
        }
        setSearchTimeout(setTimeout(() => {
            getUser(inputValue, callback)
        }, 800))
    };
    useEffect(() => {
        getUser();
    }, [])
    const handleSubmitProject = (e) => {
        e.preventDefault()
        setLoading(true);
        let formData = new FormData();
        formData.append('name', projectData.name)
        formData.append('icon', projectData.icon)
        formData.append('description', projectData.description)
        formData.append('members_id', JSON.stringify(projectData.members_id))
        ApiService.POST_FORMDATA(ApiRoutes.project, formData, (res) => {
            setLoading(false);
            if (res.status === 'ok') {
                navigate('/dashboard')
            }
        })
    }
    const handleChangeImage = (e) => {
        setProjectData(
            (prevData) => ({
                ...prevData,
                icon: e.target.files[0],
            })
        )
        setProjectData(
            (prevData) => ({
                ...prevData,
                icon_show: URL.createObjectURL(e.target.files[0])
            })
        )
    }
    return (
        <div className={`w-full max-w-2xl mx-auto`}>
            <form onSubmit={handleSubmitProject} className="rounded-lg border shadow-sm mb-8">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Create
                        Project</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2 form-input">
                        <label className="text-sm font-medium leading-none" htmlFor="name">
                            Name
                        </label>
                        <input className="input" id="name" name={`name`}
                               onChange={(event) => setProjectData(
                                   (prevData) => ({
                                       ...prevData,
                                       name: event.target.value,
                                   })
                               )}
                        />
                        <small className="text-red-500 text-sm invalid-feedback"></small>
                    </div>
                    <div className="space-y-2 form-input">
                        <label className="text-sm font-medium leading-none" htmlFor="description">
                            Short Description
                        </label>
                        <input className="input" id="description" name={`description`}
                               onChange={(event) => setProjectData(
                                   (prevData) => ({
                                       ...prevData,
                                       description: event.target.value,
                                   })
                               )}
                        />
                        <small className="text-red-500 text-sm invalid-feedback"></small>
                    </div>
                    <div className="space-y-2 form-input">
                        <label className="text-sm font-medium leading-none" htmlFor="description">
                            Select Members
                        </label>
                        <AsyncSelect isMulti={true} loadOptions={loadUser}
                                     options={users} defaultOptions={users} placeholder={``}
                                     onChange={(newValue) => setProjectData(
                                         (prevData) => ({
                                             ...prevData,
                                             members_id: newValue.map(each => each.value),
                                         })
                                     )}
                        />
                        <small className="text-red-500 text-sm invalid-feedback"></small>
                    </div>
                    <div className="gap-4 form-input">
                        {projectData.icon_show && (
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24">
                                 <img src={projectData.icon_show} alt=""/>
                            </span>
                        )}
                        <label htmlFor={`avatar`} className="btn-black !w-auto cursor-pointer mt-2">
                            Select Project Icon
                        </label>
                        <input type="file" id={`avatar`} name="avatar" accept={'image/png, image/jpg, image/jpeg'}
                               onChange={handleChangeImage} className={`hidden`}/>
                        <small className="text-red-500 text-sm invalid-feedback"></small>
                    </div>
                </div>
                <div className="flex items-center justify-end p-6">
                    <Link to={`/dashboard`}
                          className="btn-white mr-3">Cancel</Link>
                    <button className={`btn-black !w-1/4 ${loading ? 'btn-loading' : ''}`}>
                        Create Project
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProject;