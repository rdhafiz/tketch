const StateModel = require("../../../model/State");
const deleteState = async (req, res) => {
    try {
        const {id} = req.params
        const label = await StateModel.deleteOne({_id: id}).exec()
        if (label.deletedCount > 0) {
            // Returning a 200 OK response with message
            return res.status(200).json({ message: 'State has been deleted successfully', status: 'ok'});
        }
        res.status(400).json({ message: 'Cannot delete label',});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = deleteState