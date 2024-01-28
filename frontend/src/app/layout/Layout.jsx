import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import Sidenav from "./Sidenav.jsx";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function Layout() {
    return (
        <>
            <div className={`bg-cyan-500 bg-green-600 bg-pink-500 bg-amber-500 bg-blue-500 bg-emerald-500 bg-fuchsia-500 bg-indigo-500 bg-lime-600 bg-slate-600`}></div>
            <div className="flex flex-col h-screen">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidenav />
                    <main className="flex-1 p-4 overflow-auto">
                        <Outlet />
                    </main>
                </div>
                <ToastContainer />
            </div>
        </>

    );
}

export default Layout;