const TaskModel = require("../../../model/Task");
const manageLabel = async (req, res) => {
    try {
        const {id} = req.params
        const {labels} = req.body
        const task = await TaskModel.updateOne({_id: id}, {label_id: labels}).exec()
        if (task.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Task label has been updated successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot update Task',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = manageLabel