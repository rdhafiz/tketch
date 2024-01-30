const ProjectModel = require("../../../model/Project");
const deleteProject = async (req, res) => {
    try {
        const {id} = req.params
        const project = await ProjectModel.updateOne({_id: id}, {deleted_at: Date.now()}).exec()
        if (project.modifiedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'Project has been deleted successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot delete Project',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = deleteProject