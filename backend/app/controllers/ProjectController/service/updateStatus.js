const ProjectModel = require("../../../model/Project");
const {projectStatus} = require("../../../constants/projectStatus");
const updateStatus = async (req, res) => {
    try {
        const {id} = req.params
        const project = await ProjectModel.findById(id);
        if (!project instanceof ProjectModel) {
            res.status(400).json({ message: 'Cannot find Project',});
        }
        project.status = project.status === projectStatus.ACTIVE ? projectStatus.ARCHIVE : projectStatus.ACTIVE
        project.save();
        return res.status(200).json({ message: 'Project has been ' +project.status+ ' successfully', status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = updateStatus