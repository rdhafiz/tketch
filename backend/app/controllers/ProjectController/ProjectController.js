const create = require('./service/create');
const update = require('./service/update');
const get = require('./service/get');
const deleteProject = require('./service/delete');
const updateStatus = require('./service/updateStatus');
const addMember = require('./service/addMember');
const removeMember = require('./service/removeMember');
const projectController = {
    /**
     * @desc create function called by route to create project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    create: async (req, res) => {
        await create(req, res);
    },
    /**
     * @desc update function called by route to update project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    update: async (req, res) => {
        await update(req, res);
    },
    /**
     * @desc get function called by route to get single or paginate project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    get: async (req, res) => {
        await get(req, res);
    },
    /**
     * @desc delete function called by route to delete project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    delete: async (req, res) => {
        await deleteProject(req, res);
    },
    /**
     * @desc updateStatus function called by route to update status of a project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    updateStatus: async (req, res) => {
        await updateStatus(req, res);
    },
    /**
     * @desc addMember function called by route to add members to a project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    addMember: async (req, res) => {
        await addMember(req, res);
    },
    /**
     * @desc removeMember function called by route to remove members from a project
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    removeMember: async (req, res) => {
        await removeMember(req, res);
    },
}

module.exports = projectController;