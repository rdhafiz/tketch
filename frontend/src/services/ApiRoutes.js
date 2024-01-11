const baseUrl = 'http://localhost:4000'
const ApiRoutes = {
    // auth
    login: baseUrl + '/auth/login',
    register: baseUrl + '/auth/register',
    verify: baseUrl + '/auth/verify',
    forgotPassword: baseUrl + '/auth/forgot/password',
    resetPassword: baseUrl + '/auth/reset/password',

};
export default ApiRoutes;
