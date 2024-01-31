const {taskStatusArray} = require("../../../constants/taskStatus");
const getStatus = async (req, res) => {
    try {
        return res.status(200).json({ data: taskStatusArray, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = getStatus