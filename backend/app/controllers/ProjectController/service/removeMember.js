const ProjectModel = require("../../../model/Project");
const removeMember = async (req, res) => {
    try {
        const {id} = req.params
        const { members_id } = req.body
        const project = await ProjectModel.updateOne({_id: id}, {$pull: {members_id: members_id}}).exec()
        if (project.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Member has been removed successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot delete Project',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = removeMember