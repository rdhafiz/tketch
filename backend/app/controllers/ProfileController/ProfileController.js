const get = require('./service/get');
const update = require('./service/update');
const updatePassword = require('./service/updatePassword');

const ProfileController = {
    /**
     * @desc get function called by route to get session user profile
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    get: async (req, res) => {
        await get(req, res);
    },
    /**
     * @desc update function called by route to update profile of session user such as name, avatar etc.
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    update: async (req, res) => {
        await update(req, res);
    },
    /**
     * @desc updatePassword function called by route to update password of session user
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    updatePassword: async (req, res) => {
        await updatePassword(req, res);
    },
};

// Exporting the authentication controller object for use in other modules
module.exports = ProfileController;