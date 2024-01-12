import {Link, useRouteError} from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="w-48 h-48 text-gray-900 dark:text-gray-100"></div>
            <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">404</h1>
            <h2 className="text-4xl font-semibold text-gray-700 dark:text-gray-300">Page Not Found</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">The page you were looking for doesn't exist.</p>
            <Link to={`/`} className="inline-flex items-center justify-center h-10 px-5 font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
                href="#">
                Go back home
            </Link>
        </div>
    );
}