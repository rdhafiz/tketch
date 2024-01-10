const register = require('./service/register');
const login = require('./service/login');
const verifyAccount = require('./service/verifyAccount');
const forgotPassword = require('./service/forgotPassword');
const resetPassword = require('./service/resetPassword');

const AuthController = {
    /**
     * @desc register function called by route
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - public
     */
    register: async (req, res) => {
        await register(req, res);
    },
    /**
     * @desc verify account function called by route
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - public
     */
    verifyAccount: async (req, res) => {
        await verifyAccount(req, res);
    },
    /**
     * @desc login function called by route
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - public
     */
    login: async (req, res) => {
        await login(req, res);
    },
    /**
     * @desc forgotPassword function called by route
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - public
     */
    forgotPassword: async (req, res) => {
        await forgotPassword(req, res);
    },
    /**
     * @desc resetPassword function called by route
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - public
     */
    resetPassword: async (req, res) => {
        await resetPassword(req, res);
    }
};

// Exporting the authentication controller object for use in other modules
module.exports = AuthController;