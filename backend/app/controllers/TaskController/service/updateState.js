const TaskModel = require("../../../model/Task");
const mongoose = require('mongoose');
const updateState = async (req, res) => {
    try {
        const {id} = req.params;
        const {state_id} = req.body;
        const task = await TaskModel.findById(id);
        if (!task instanceof TaskModel) {
            res.status(400).json({ message: 'Cannot find Task',});
        }
        task.state_id = new mongoose.Types.ObjectId(state_id)
        task.save();
        return res.status(200).json({ message: 'Task state has been updated successfully', status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = updateState