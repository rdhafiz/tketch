const TaskModel = require("../../../model/Task");
const mongoose = require('mongoose');
const updateLabel = async (req, res) => {
    try {
        const {id} = req.params;
        const {label_id} = req.body;
        const task = await TaskModel.updateOne({_id: id}, {$set: {label_id: label_id}}).exec()
        if (task.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Task label has been updated successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot update Task'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = updateLabel