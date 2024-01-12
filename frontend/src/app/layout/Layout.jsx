import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "./Header.jsx";
import Sidenav from "./Sidenav.jsx";

function Layout() {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidenav />
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;