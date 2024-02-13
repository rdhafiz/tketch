const ProjectModel = require("../../../model/Project");
const mongoose = require('mongoose');

const getSingle = async (req, res) => {
    try {

        const filterData = {
            id: req.params.id,
        }
        const project = await ProjectModel.aggregate([
            {
                $match: {_id: new mongoose.Types.ObjectId(filterData.id)},
            },

            {
                $addFields: {
                    'iconFullPath': {
                        $cond: {
                            if: {$ne: ['$icon', null]},
                            then: {$concat: [process.env.APP_URL, '/uploads/', '$icon']},
                            else: null
                        }
                    },
                    'members_id_as_objectId': {
                        $map: {
                            input: "$members_id",
                            as: "memberId",
                            in: { $toObjectId: "$$memberId" },
                        },
                    }
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "members_id_as_objectId",
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
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    creator_id: 1,
                    icon: 1,
                    iconFullPath: 1,
                    status: 1,
                }
            },
        ]).exec();
        if (project.length > 0) {
            // Returning a 200 OK response with project data
            res.status(200).json({data: project[0], status: 'ok'});
        } else {
            res.status(400).json({ message: 'Cannot find Project',});
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = getSingle

