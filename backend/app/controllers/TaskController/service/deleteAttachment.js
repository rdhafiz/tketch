const TaskModel = require("../../../model/Task");
const mongoose = require("mongoose");
const getAttachment = require("./getAttachment");
const deleteAttachment = async (req, res) => {
    try {
        const {id, attachmentId} = req.params
        const task = await TaskModel.updateOne({_id: id}, {$pull: {attachment: {_id: new mongoose.Types.ObjectId(attachmentId)}}}).exec()
        if (task.modifiedCount > 0) {
            const attachments = await getAttachment(id);
            // Returning a 200 OK response with message
            return res.status(200).json({message: 'Task attachment has been deleted successfully', attachments: attachments[0].attachment, status: 'ok'});
        }
        res.status(400).json({message: 'Cannot update Task'})
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = deleteAttachment