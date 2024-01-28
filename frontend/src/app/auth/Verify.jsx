import React, {useState} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";
import ApiService from "../../services/ApiService.js";
import ApiRoutes from "../../services/ApiRoutes.js";
import AuthService from "../../services/AuthService.js";
import useStore from "../../store/store.js";


function Verify() {
    const { setUser } = useStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {email, message} = location.state
    const handleSubmit = (event) => {
        event.preventDefault();
        ApiService.ClearErrorHandler()
        let param = {
            email: email,
            code: event.target.code.value,
        }
        setLoading(true);
        ApiService.POST(ApiRoutes.verify, param, (res) => {
            setLoading(false);
            if (res.status === 'ok') {
                AuthService.setAuthentication(res.access_token, res.data);
                setUser(res.data);
                navigate('/dashboard')
            }
        })
    }
    return (
        <form onSubmit={handleSubmit} className="rounded-lg border shadow-sm w-full max-w-md bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-2xl text-center">Verify Account</h3>
                <p className="text-sm  text-center">
                    Enter activation key to active your account.
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
                    <label className="text-sm font-medium leading-none" htmlFor="code">Activation Code</label>
                    <input className="input" id="code" name="code" placeholder="code" required="" type="text"/>
                    <small className="text-red-500 text-sm invalid-feedback"></small>
                </div>
            </div>
            <div className="items-center p-6 pt-4 flex flex-col space-y-2">
                <button type={`submit`} className={`btn-black ${loading ? 'btn-loading' : ''}`}>Submit</button>
                <div className="flex items-center justify-center space-x-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Have an account?</span>
                    <Link to={`/`} className="text-sm text-cyan-500 dark:text-gray-400">Login</Link>
                </div>
            </div>
        </form>
    );
}

export default Verify;