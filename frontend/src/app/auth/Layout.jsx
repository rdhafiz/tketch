import React from 'react';
import {Outlet} from "react-router-dom";

function Login() {
    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
               <Outlet />
            </div>
        </div>
    );
}

export default Login;