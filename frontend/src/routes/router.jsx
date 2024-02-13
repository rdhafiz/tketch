import {createBrowserRouter} from "react-router-dom";
import Login from "../app/auth/Login.jsx";
import Register from "../app/auth/Register.jsx";
import AuthLayout from "../app/auth/Layout.jsx";
import ForgotPassword from "../app/auth/ForgotPassword.jsx";
import Dashboard from "../app/dashboard/Dashboard.jsx";
import RouteGuard from "../AuthGuard.jsx";
import Layout from "../app/layout/Layout.jsx";
import Verify from "../app/auth/Verify.jsx";
import ErrorPage from "../app/notFound/notFound.jsx";
import ResetPassword from "../app/auth/ResetPassword.jsx";
import Profile from "../app/profile/Profile.jsx";
import AddProject from "../app/project/AddProject.jsx";
import EditProject from "../app/project/EditProject.jsx";
import Task from "../app/task/Task.jsx";
import TaskSingle from "../app/task/TaskSingle.jsx";
export const router = createBrowserRouter(
    [
        {
            path:'/',
            element: <RouteGuard.Public> < AuthLayout/> </RouteGuard.Public>,
            errorElement: <ErrorPage></ErrorPage>,
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
                    path:'/verify/account',
                    element:<Verify/>,
                },
                {
                    path:'/forgot/password',
                    element:<ForgotPassword/>,
                },
                {
                    path:'/reset/password',
                    element:<ResetPassword/>,
                },
            ]
        },
        {
            path:'/dashboard',
            element: <RouteGuard.Protected> < Layout/> </RouteGuard.Protected>,
            errorElement: <ErrorPage></ErrorPage>,
            children: [
                {
                    path:'/dashboard',
                    element:<Dashboard/>,
                },
                {
                    path:'/dashboard/profile',
                    element:<Profile/>,
                },
                {
                    path:'/dashboard/project/create',
                    element:<AddProject/>,
                },
                {
                    path:'/dashboard/project/:id',
                    element:<EditProject/>,
                },
                {
                    path:'/dashboard/project/:id/task',
                    element:<Task/>,
                },
                {
                    path:'/dashboard/project/:id/task/:taskId',
                    element:<TaskSingle/>,
                },
            ]
        },
    ]
)