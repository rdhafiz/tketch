const {taskPriorityArray} = require("../../../constants/taskPriority");
const getPriority = async (req, res) => {
    try {
        return res.status(200).json({ data: taskPriorityArray, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports = getPriority