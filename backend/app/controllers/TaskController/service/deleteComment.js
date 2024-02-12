const TaskModel = require("../../../model/Task");
const mongoose = require("mongoose");
const getComments = require("./getComments");
const deleteComment = async (req, res) => {
    try {
        const {id, commentId} = req.params
        const task = await TaskModel.updateOne({_id: id}, {$pull: {comments: {_id: new mongoose.Types.ObjectId(commentId)}}}).exec()
        if (task.modifiedCount > 0) {
            const comments = await getComments(id);
            // Returning a 200 OK response with message
            return res.status(200).json({message: 'Task comments has been deleted successfully', comments: comments[0].comments, status: 'ok'});
        }
        res.status(400).json({message: 'Cannot update Task'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = deleteComment