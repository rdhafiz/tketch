import React from 'react';
import {Outlet} from "react-router-dom";

function Login() {
    return (
        <div>
            <div className="h-screen bg-gray-100 dark:bg-gray-900">
                <div className={`pt-20 pb-20 text-center text-7xl font-bold`}>tketch</div>
                <div className={`flex items-center justify-center`}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Login;