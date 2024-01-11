import React from 'react';
import {Link} from "react-router-dom";

function Register() {
    return (
        <form className="rounded-lg border shadow-sm w-full max-w-md bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold tracking-tight text-2xl text-center">Registration</h3>
                <p className="text-sm  text-center">
                    Enter your details to register your account.
                </p>
            </div>
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                    <input className="w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                           id="email" name="email" placeholder="m@example.com" required="" type="email"/>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">Password</label>
                    <input className="flex  w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                           id="password" name="password" required="" type="password"/>
                </div>
            </div>
            <div className="items-center p-6 pt-4 flex flex-col space-y-2">
                <button
                    className="btn-black">Register
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