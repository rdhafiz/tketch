import React, {useState} from 'react';
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import AuthService from "../../services/AuthService.js";
import TwoLetterName from "../components/TwoLetterName.jsx";
import {toast} from "react-toastify";
import useStore from "../../store/store.js";

const Profile = () => {
    const {user, setUser} = useStore();
    const [profile, setProfile] = useState(user)
    const [loading, setLoading] = useState({profile: false, password: false})
    const handleChangeImage = (e) => {
        setProfile({avatarFullPath: URL.createObjectURL(e.target.files[0])})
    }
    const handleSubmitProfile = (event) => {
        event.preventDefault();
        ApiService.ClearErrorHandler()
        const formData = new FormData(document.getElementById('profile'));
        setLoading((prevLoading) => ({
            ...prevLoading,
            profile: true,
        }));
        ApiService.PATCH_FORMDATA(ApiRoutes.profile, formData, (res) => {
            setLoading((prevLoading) => ({
                ...prevLoading,
                profile: false,
            }));
            if (res.status === 'ok') {
                AuthService.setUser(res.data)
                setUser(res.data)
                toast.success(res.message)
            }
        })
    }
    const handleSubmitPassword = (event) => {
        event.preventDefault();
        ApiService.ClearErrorHandler()
        let param = {
            current_password: event.target.current_password.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value
        }
        setLoading((prevLoading) => ({
            ...prevLoading,
            password: true,
        }));
        ApiService.PATCH(ApiRoutes.passwordUpdate, param, (res) => {
            setLoading((prevLoading) => ({
                ...prevLoading,
                password: false,
            }));
            if (res.status === 'ok') {
                toast.success(res.message);
                event.target.reset();
            }
        })
    }
    return (
        <>
            <div className="w-full max-w-2xl mx-auto">
                {profile && (
                <form onSubmit={handleSubmitProfile} className="rounded-lg border shadow-sm mb-8" encType={`multipart/form-data`} id={`profile`}>
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Personal
                            Information</h3>
                        <p className="text-sm text-muted-foreground">Edit your personal information.</p>
                    </div>

                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-4 form-input">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24">
                                {profile.avatarFullPath ? (
                                    <img src={profile.avatarFullPath} alt=""/>
                                ) : (
                                    <span className={`flex h-full w-full items-center justify-center rounded-full ${user.color}`}>
                                        <TwoLetterName name={profile.name}/>
                                    </span>
                                )}

                            </span>
                                <label htmlFor={`avatar`} className="btn-black !w-auto cursor-pointer">
                                    Change Picture
                                </label>
                                <input type="file" id={`avatar`} name="avatar" accept={'image/png, image/jpg, image/jpeg'} onChange={handleChangeImage} className={`hidden`}/>
                                <small className="text-red-500 text-sm invalid-feedback"></small>
                            </div>
                            <div className="space-y-2 form-input">
                                <label className="text-sm font-medium leading-none" htmlFor="name">
                                    Name
                                </label>
                                <input className="input" id="name" name={`name`} placeholder="Enter your name" defaultValue={profile.name}/>
                                <small className="text-red-500 text-sm invalid-feedback"></small>
                            </div>
                            <div className="space-y-2 form-input">
                                <label className="text-sm font-medium leading-none" htmlFor="email">
                                    Email
                                </label>
                                <input className="input disabled:cursor-not-allowed disabled:bg-gray-100" value={profile.email} disabled id="email" placeholder="Enter your email" type="email"/>
                                <small className="text-red-500 text-sm invalid-feedback"></small>
                            </div>
                        </div>
                    <div className="flex items-center justify-end p-6">
                        <button className={`btn-black !w-1/4 ${loading.profile ? 'btn-loading' : ''}`}>
                            Save Changes
                        </button>
                    </div>
                </form>
                )}
                <form onSubmit={handleSubmitPassword} className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold whitespace-nowrap leading-none tracking-tight">Change
                            Password</h3>
                        <p className="text-sm text-muted-foreground">Update your account password.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2 form-input">
                            <label className="text-sm font-medium leading-none" htmlFor="current-password">
                                Current Password
                            </label>
                            <input className="input" id="current-password" name={`current_password`} placeholder="Enter your current password" type="password"/>
                            <small className="text-red-500 text-sm invalid-feedback"></small>
                        </div>
                        <div className="space-y-2 form-input">
                            <label className="text-sm font-medium leading-none" htmlFor="new-password">
                                New Password
                            </label>
                            <input className="input" id="new-password" name={`password`} placeholder="Enter your new password" type="password"/>
                            <small className="text-red-500 text-sm invalid-feedback"></small>
                        </div>
                        <div className="space-y-2 form-input">
                            <label className="text-sm font-medium leading-none" htmlFor="confirm-password">
                                Confirm New Password
                            </label>
                            <input className="input" id="confirm-password" name={`confirm_password`} placeholder="Confirm your new password" type="password"/>
                            <small className="text-red-500 text-sm invalid-feedback"></small>
                        </div>
                    </div>
                    <div className="flex items-center justify-end p-6">
                        <button className={`btn-black !w-1/4 ${loading.password ? 'btn-loading' : ''}`}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </>);
};

export default Profile;