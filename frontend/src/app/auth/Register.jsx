import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";


function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        ApiService.ClearErrorHandler()
        let param = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value
        }
        setLoading(true);
        ApiService.POST(ApiRoutes.register, param, (res) => {
            setLoading(false);
            if (res.status === 'ok') {
                navigate("/verify/account", {state: {message: res.message, email: param.email}});
            }
        })
    }
    return (
        <form onSubmit={handleSubmit} className="rounded-lg border shadow-sm w-full max-w-md bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-2xl text-center">Registration</h3>
                <p className="text-sm  text-center">
                    Enter your details to register your account.
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium leading-none" htmlFor="name">Name</label>
                    <input className="input" id="name" name="name" placeholder="Name" required="" type="text"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <input className="input" id="email" name="email" placeholder="m@example.com" required=""
                           type="email"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium" htmlFor="password">Password</label>
                    <input className=" input" id="password" name="password" required="" type="password"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium" htmlFor="confirm_password">Confirm Password</label>
                    <input className=" input" id="confirm_password" name="confirm_password" required=""
                           type="password"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
            </div>
            <div className="items-center p-6 pt-4 flex flex-col space-y-2">
                <button type={`submit`} className={`btn-black ${loading ? 'btn-loading' : ''}`}>Register
                </button>
                <div className="flex items-center justify-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Have an account?</span>
                    <Link to={`/`} className="text-sm text-cyan-500 dark:text-gray-400">Login</Link>
                </div>
            </div>
        </form>
    );
}

export default Register;