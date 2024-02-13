const TaskModel = require("../../../model/Task");
const {taskStatus} = require("../../../constants/taskStatus");
const updateStatus = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        const task = await TaskModel.findById(id);
        if (!task instanceof TaskModel) {
            res.status(400).json({ message: 'Cannot find Task',});
        }
        task.status = status
        task.save();
        return res.status(200).json({ message: 'Task has been ' +task.status+ ' successfully', status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = updateStatus