import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from "./services/AuthService.js";

const RouteGuard =  {
    //can only be access when user is logged in
     Protected: ({ children }) => {
        const token = AuthService.getAccessToken(false)
        const auth = ( token != null ) ? true : null ;
        // If has token, return outlet in other case return navigate to login page
        return auth ? children : <Navigate to="/" />;
    },
    //can be access when no user is logged in
     Public: ({ children }) => {
        const token = AuthService.getAccessToken(false)
        const auth = ( token != null ) ? true : null ;
        // If no token, return to login page
        return auth ? <Navigate to="/dashboard" /> : children ;
    }
}

export default RouteGuard