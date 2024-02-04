const baseUrl = 'http://localhost:4000'
const ApiRoutes = {
    // base
    base: baseUrl + '/',
    // auth
    login: baseUrl + '/auth/login',
    register: baseUrl + '/auth/register',
    verify: baseUrl + '/auth/verify',
    forgotPassword: baseUrl + '/auth/forgot/password',
    resetPassword: baseUrl + '/auth/reset/password',
    // profile
    profile: baseUrl + '/profile',
    passwordUpdate: baseUrl + '/profile/password/update',
    // users
    user: baseUrl + '/user',
    // project
    project: baseUrl + '/project',
    // task
    task: baseUrl + '/task',
    // label
    label: baseUrl + '/label',
    // state
    state: baseUrl + '/state'

};
export default ApiRoutes;
