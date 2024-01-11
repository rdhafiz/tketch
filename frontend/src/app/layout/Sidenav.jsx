import React from 'react';

const Sidenav = () => {
    return (
        <aside className="w-52 bg-gray-100 border-r dark:bg-gray-900 dark:border-gray-800">
            <nav className="flex flex-col p-4 space-y-2">
                <a
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#">
                Dashboard
                </a>
                <a
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#">
                Analytics
            </a><a
                className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#">
                Users
            </a><a className="flex items-center text-gray-900 bg-gray-200 dark:bg-gray-700 dark:text-gray-50"
                   href="#">
                Settings
            </a></nav>
        </aside>
    );
};

export default Sidenav;