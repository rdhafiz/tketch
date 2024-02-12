const TaskModel = require("../../../model/Task");
const mongoose = require("mongoose");
const getAttachment = async (id) => {
    return await TaskModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(id) }
        },
        {
            $project: {
                attachment: {
                    $map: {
                        input: "$attachment",
                        as: 'file',
                        in: {
                            $mergeObjects: [
                                '$$file',
                                {
                                    fileFullPath: { $concat: [process.env.APP_URL, '/uploads/', '$$file.file_path'] }
                                }
                            ]
                        }
                    }
                }
            }
        },
    ]).exec();
}
module.exports = getAttachment