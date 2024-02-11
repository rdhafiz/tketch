const TaskModel = require("../../../model/Task");
const deleteTask = async (req, res) => {
    try {
        const {id} = req.params
        let {date} = req.body
        if (date) {
            date = new Date(date)
        } else {
            date = null
        }
        const task = await TaskModel.updateOne({_id: id}, {due_at: date}).exec()
        if (task.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Task due date has been update successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot delete Task',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = deleteTask