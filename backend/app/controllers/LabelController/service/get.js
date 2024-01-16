const LabelModel = require("../../../model/Label");
const get = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const filterData = {
            id: req.query.id,
            keyword: req.query.keyword ?? ''
        }
        // Finding labels
        let label = null
        if (filterData?.id) {
            label = await LabelModel.findById(filterData.id).exec()
        } else {
            label = await LabelModel.find({project_id: projectId, name: { $regex: new RegExp(filterData.keyword, 'i') }}).exec();
        }
        // Returning a 200 OK response with label data
        res.status(200).json({ data: label, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = get