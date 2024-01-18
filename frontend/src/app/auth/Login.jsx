import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import AuthService from "../../services/AuthService.js";
import useStore from "../../store/store.js";

function Login() {
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const location = useLocation();
    const message = location?.state?.message
    const handleSubmit = (event) => {
        event.preventDefault();
        ApiService.ClearErrorHandler()
        let param = {
            email: event.target.email.value,
            password: event.target.password.value
        }
        setLoading(true);
        ApiService.POST(ApiRoutes.login, param, (res) => {
            setLoading(false);
            if (res.status === 'ok') {
                AuthService.setAuthentication(res.access_token, res.data);
                setUser(res.data);
                navigate('/dashboard')
            } else if (res.status === 'email sent') {
                navigate("/verify/account", {state: {message: res.message, email: param.email}});
            }
        })
    }
    return (
        <form onSubmit={handleSubmit} className="rounded-lg border shadow-sm w-full max-w-md bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-2xl text-center">Login</h3>
                <p className="text-sm  text-center">
                    Enter your email and password to login to your account.
                </p>
            </div>
            {message ? (
                <div className="p-4 space-y-4">
                    <div role="alert" className="alert info">
                        {message}
                    </div>
                </div>
            ) : ('')
            }
            <div className="p-6 space-y-4">
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <input className="input"
                           id="email" name="email" placeholder="m@example.com" required="" type="email"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
                <div className="space-y-2 form-input">
                    <label className="text-sm font-medium" htmlFor="password">Password</label>
                    <input className="input"
                           id="password" name="password" required="" type="password"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
            </div>
            <div className="items-center p-6 pt-4 flex flex-col space-y-2">
                <button type="submit" disabled={loading}
                    className={`btn-black ${loading ? 'btn-loading' : ''}`}>Login
                </button>
                <Link to={`forgot/password`} className="text-sm text-center text-cyan-500 dark:text-gray-400">
                    Forgot Password?
                </Link>
                <div className="flex items-center justify-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Don't have an account?</span>
                    <Link to={`/register`} className="text-sm text-cyan-500 dark:text-gray-400">Create an Account</Link>
                </div>
            </div>
        </form>
    );
}

export default Login;