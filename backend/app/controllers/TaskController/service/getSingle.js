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
                    formattedDate: {
                        $dateToString: {
                            format: "%Y-%m-%d", // specify the desired format
                            date: "$due_at" // specify the field containing the date
                        }
                    },
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
            { $unwind: "$comments" },
            {
                $addFields: {
                    "comments.user_id": { $toObjectId: "$comments.user_id" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user_id",
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
                    as: "comments.user_details"
                }
            },
            {
                $unwind: "$comments.user_details" // Unwind the array into separate documents
            },
            {
                $addFields: {
                    "comments.comment_time": {
                        $let: {
                            vars: {
                                currentTime: new Date(),
                                commentTime: "$comments.created_at"
                            },
                            in: {
                                $concat: [
                                    {
                                        $cond: {
                                            if: { $gte: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 31536000000] }, // 1 year in milliseconds
                                            then: {
                                                $concat: [
                                                    { $toString: { $floor: { $divide: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 31536000000] } } },
                                                    " years ago"
                                                ]
                                            },
                                            else: {
                                                $cond: {
                                                    if: { $gte: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 2592000000] }, // 1 month in milliseconds
                                                    then: {
                                                        $concat: [
                                                            { $toString: { $floor: { $divide: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 2592000000] } } },
                                                            " months ago"
                                                        ]
                                                    },
                                                    else: {
                                                        $cond: {
                                                            if: { $gte: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 86400000] }, // 1 day in milliseconds
                                                            then: {
                                                                $concat: [
                                                                    { $toString: { $floor: { $divide: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 86400000] } } },
                                                                    " days ago"
                                                                ]
                                                            },
                                                            else: {
                                                                $cond: {
                                                                    if: { $gte: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 3600000] }, // 1 hour in milliseconds
                                                                    then: {
                                                                        $concat: [
                                                                            { $toString: { $floor: { $divide: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 3600000] } } },
                                                                            " hours ago"
                                                                        ]
                                                                    },
                                                                    else: {
                                                                        $concat: [
                                                                            { $toString: { $floor: { $divide: [{ $subtract: ["$$currentTime", "$$commentTime"] }, 60000] } } },
                                                                            " minutes ago"
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $unwind: "$comments"
            },
            {
                $sort: { "comments._id": -1 }
            },
            {
                $group: {
                    _id: "$_id",
                    assignee: { $first: "$assignee" },
                    assignee_as_objectId: { $first: "$assignee_as_objectId" },
                    attachment: { $first: "$attachment" },
                    label: { $first: "$label" },
                    label_as_objectId: { $first: "$label_as_objectId" },
                    label_id: { $first: "$label_id" },
                    members: { $first: "$members" },
                    name: { $first: "$name" },
                    description: { $first: "$description" },
                    priority: { $first: "$priority" },
                    project_id: { $first: "$project_id" },
                    reporter: { $first: "$reporter" },
                    state: { $first: "$state" },
                    state_id: { $first: "$state_id" },
                    state_objectId: { $first: "$state_objectId" },
                    status: { $first: "$status" },
                    comments: { $push: "$comments" }
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

