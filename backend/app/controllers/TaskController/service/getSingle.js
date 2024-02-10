const TaskModel = require("../../../model/Task");
const mongoose = require('mongoose');

const getSingle = async (req, res) => {
    try {

        const filterData = {
            id: req.params.id,
        }
        const task = await TaskModel.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(filterData.id)},
            },
            {
                $addFields: {
                    'assignee_as_objectId': {
                        $map: {
                            input: "$assignee",
                            as: "assigneeId",
                            in: { $toObjectId: "$$assigneeId" },
                        },
                    },
                    'creator_objectId': {
                        $toObjectId: "$creator_id"
                    },
                    'label_as_objectId': {
                        $map: {
                            input: "$label_id",
                            as: "labelId",
                            in: { $toObjectId: "$$labelId" },
                        },
                    },
                    'state_objectId': {
                        $toObjectId: "$state_id"
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "assignee_as_objectId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $addFields: {
                                'avatarFullPath': {
                                    $cond: {
                                        if: {$ne: ['$avatar', null]},
                                        then: {$concat: [process.env.APP_URL, '/uploads/', '$avatar']},
                                        else: null
                                    }
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                avatar: 1,
                                avatarFullPath: 1,
                                color: 1,
                            }
                        }
                    ],
                    as: "members",
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "creator_objectId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $addFields: {
                                'avatarFullPath': {
                                    $cond: {
                                        if: {$ne: ['$avatar', null]},
                                        then: {$concat: [process.env.APP_URL, '/uploads/', '$avatar']},
                                        else: null
                                    }
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                avatar: 1,
                                avatarFullPath: 1,
                                color: 1,
                            }
                        }
                    ],
                    as: "reporter"
                },
            },
            {
                $unwind: {
                    path: '$reporter',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "labels",
                    localField: "label_as_objectId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                color: 1,
                                description: 1,
                            }
                        }
                    ],
                    as: "label"
                },
            },
            {
                $lookup: {
                    from: "states",
                    localField: "state_objectId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                            }
                        }
                    ],
                    as: "state"
                },
            },
            {
                $unwind: {
                    path: '$state',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $addFields: {
                    'attachment': {
                        $map: {
                            input: '$attachment',
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
        if (task.length > 0) {
            // Returning a 200 OK response with project data
            res.status(200).json({data: task[0], status: 'ok'});
        } else {
            res.status(400).json({ message: 'Cannot find Task',});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = getSingle

