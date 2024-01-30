const {projectStatusArray} = require("../../../constants/projectStatus");
const getStatus = async (req, res) => {
    try {
        return res.status(200).json({ data: projectStatusArray, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = getStatus