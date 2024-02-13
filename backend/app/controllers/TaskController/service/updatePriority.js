const TaskModel = require("../../../model/Task");
const {taskPriority} = require("../../../constants/taskPriority");
const updatePriority = async (req, res) => {
    try {
        const {id} = req.params;
        const {priority} = req.body;
        const task = await TaskModel.findById(id);
        if (!task instanceof TaskModel) {
            res.status(400).json({ message: 'Cannot find Task',});
        }
        task.priority = priority
        task.save();
        return res.status(200).json({ message: 'Task priority has been updated successfully', status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = updatePriority