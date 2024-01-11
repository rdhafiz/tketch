import {createBrowserRouter} from "react-router-dom";
import Login from "../app/auth/Login.jsx";
import Register from "../app/auth/Register.jsx";
import AuthLayout from "../app/auth/Layout.jsx";
import ForgotPassword from "../app/auth/ForgotPassword.jsx";
import Dashboard from "../app/dashboard/Dashboard.jsx";
import RouteGuard from "../AuthGuard.jsx";
import Layout from "../app/layout/Layout.jsx";
export const router = createBrowserRouter(
    [
        {
            path:'/',
            element: <RouteGuard.Public> < AuthLayout/> </RouteGuard.Public>,
            children: [
                {
                    path:'/',
                    element:<Login/>,
                },
                {
                    path:'/register',
                    element:<Register/>,
                },
                {
                    path:'/forgot/password',
                    element:<ForgotPassword/>,
                },
            ]
        },
        {
            path:'/dashboard',
            element: <RouteGuard.Protected> < Layout/> </RouteGuard.Protected>,
            children: [
                {
                    path:'/dashboard',
                    element:<Dashboard/>,
                },
            ]
        },
    ]
)