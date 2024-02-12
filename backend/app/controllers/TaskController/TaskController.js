const create = require('./service/create');
const get = require('./service/get');
const update = require('./service/update');
const deleteTask = require('./service/delete');
const updateStatus = require('./service/updateStatus');
const getSingle = require('./service/getSingle');
const getStatus = require('./service/getStatus');
const nameUpdate = require('./service/nameUpdate');
const descUpdate = require('./service/descUpdate');
const addComment = require('./service/addComment');
const updateComment = require('./service/updateComment');
const deleteComment = require('./service/deleteComment');
const manageAssignee = require('./service/manageAssignee');
const manageLabel = require('./service/manageLabel');
const manageState = require('./service/manageState');
const updatePriority = require('./service/updatePriority');
const addAttachment = require('./service/addAttachment');
const deleteAttachment = require('./service/deleteAttachment');
const dueDate = require('./service/dueDate');
const taskController = {
    /**
     * @desc create function called by route to create task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    create: async (req, res) => {
        await create(req, res);
    },
    /**
     * @desc update function called by route to update task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    update: async (req, res) => {
        await update(req, res);
    },
    /**
     * @desc get function called by route to get single or paginate task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    get: async (req, res) => {
        await get(req, res);
    },
    /**
     * @desc delete function called by route to delete task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    delete: async (req, res) => {
            await deleteTask(req, res);
    },
    /**
     * @desc updateStatus function called by route to update status of a task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    updateStatus: async (req, res) => {
        await updateStatus(req, res);
    },
    /**
     * @desc updatePriority function called by route to update priority of a task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    updatePriority: async (req, res) => {
        await updatePriority(req, res);
    },
    /**
     * @desc get single function called by route to get single a task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    getSingle: async (req, res) => {
        await getSingle(req, res);
    },
    /**
     * @desc getStatus function called by route to get status of task
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    getStatus: async (req, res) => {
        await getStatus(req, res);
    },
    /**
     * @desc nameUpdate function called by route to update the task name
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    nameUpdate: async (req, res) => {
        await nameUpdate(req, res);
    },
    /**
     * @desc descUpdate function called by route to update the task description
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    descUpdate: async (req, res) => {
        await descUpdate(req, res);
    },
    /**
     * @desc addComment function called by route to add comment
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    addComment: async (req, res) => {
        await addComment(req, res);
    },
    /**
     * @desc updateComment function called by route to update comment
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    updateComment: async (req, res) => {
        await updateComment(req, res);
    },
    /**
     * @desc deleteComment function called by route to delete comment
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    deleteComment: async (req, res) => {
        await deleteComment(req, res);
    },
    /**
     * @desc manageAssignee function called by route to update assignee
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    manageAssignee: async (req, res) => {
        await manageAssignee(req, res);
    },
    /**
     * @desc manageLabel function called by route to update label
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    manageLabel: async (req, res) => {
        await manageLabel(req, res);
    },
    /**
     * @desc manageState function called by route to update state
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    manageState: async (req, res) => {
        await manageState(req, res);
    },
    /**
     * @desc addAttachment function called by route to add attachment
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    addAttachment: async (req, res) => {
        await addAttachment(req, res);
    },
    /**
     * @desc deleteAttachment function called by route to delete attachment
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    deleteAttachment: async (req, res) => {
        await deleteAttachment(req, res);
    },
    /**
     * @desc dueDate function called by route to update dueDate
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    dueDate: async (req, res) => {
        await dueDate(req, res);
    },
}

module.exports = taskController;