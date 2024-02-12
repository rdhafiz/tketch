const TaskModel = require("../../../model/Task");
const mongoose = require("mongoose");
const getComments = async (id) => {
    return await TaskModel.aggregate([
        {
            $match: {_id: new mongoose.Types.ObjectId(id)},
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
                comments: { $push: "$comments" }
            }
        },
    ]).exec();
}
module.exports = getComments