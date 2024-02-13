const ProjectModel = require("../../../model/Project");

const get = async (req, res) => {
    try {
        const filterData = {
            id: req.query.id,
            keyword: req.query.keyword ?? '',
            project_type: req.query.project_type ?? '',
            list_type: req.query.status || 'active',
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50,
            skip: ((req.query.page ?? 1) - 1) * (req.query.limit || 50),
        }
        // Finding labels
        let project = null
        let result = {}
        if (filterData?.id) {
            project = await ProjectModel.findOne({_id: filterData.id}, ).exec();
            if (project instanceof ProjectModel) {
                project = {...project.toObject()}
                if (project.icon) {
                    project.iconFullPath = process.env.APP_URL + '/uploads/' + project.icon;
                }
                let removeIndex = project.members_id.indexOf(req.sessionUser['_id'])
                if (removeIndex > -1) {
                    project.members_id.splice(removeIndex, 1)
                }
                result.project = project;
            }
        } else {
            const currentUserId = req.sessionUser['_id'].toString();

            let matchCondition = {
                deleted_at: {$eq: null},
                name: {$regex: new RegExp(filterData.keyword, 'i')},
                status: {$eq: filterData.list_type},
                members_id: {
                    $elemMatch: { $eq: req.sessionUser['_id'].toString()}
                }
            };

            if (filterData.project_type === 'my') {
                // Only query with creator_id for "My Projects"
                matchCondition = {
                    deleted_at: { $eq: null },
                    name: { $regex: new RegExp(filterData.keyword, 'i') },
                    status: { $eq: filterData.list_type },
                    creator_id: currentUserId,
                };
            } else if (filterData.project_type === 'shared') {
                // Only query with members_id for "Shared Projects"
                matchCondition = {
                    deleted_at: { $eq: null },
                    name: { $regex: new RegExp(filterData.keyword, 'i') },
                    status: { $eq: filterData.list_type },
                    creator_id: { $ne: currentUserId },
                    members_id: currentUserId,
                };
            }

            project = await ProjectModel.aggregate([
                {
                    $match: matchCondition,
                },
                { $sort: { created_at: -1}},
                {
                    $project: {
                        'icon': 1,
                        'name': 1,
                        'description': 1,
                        'creator_id': 1,
                    }
                },
                {
                    $addFields: {
                        'iconFullPath': {
                            $cond: {
                                if: {$ne: ['$icon', null]},
                                then: {$concat: [process.env.APP_URL, '/uploads/', '$icon']},
                                else: null
                            }
                        }
                    },
                },
                {
                    $addFields: {
                        creator_objectId: {
                            $toObjectId: "$creator_id"
                        }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "creator_objectId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $addFields: {
                        user: {
                            $mergeObjects: [
                                "$user",
                                { avatarFullPath: { $cond: {
                                            if: {$ne: ['$user.avatar', null]},
                                            then: {$concat: [process.env.APP_URL, '/uploads/', '$user.avatar']},
                                            else: null
                                }}}
                            ]
                        }
                    }
                },
                {$skip: filterData.skip},
                {$limit: filterData.limit}
            ]).exec();
            const totalProjects = await ProjectModel.countDocuments({
                $and: [matchCondition],
            });
            let pageInfo = {
                totalData: totalProjects,
                totalPages: Math.ceil(totalProjects / filterData.limit),
                hasNextPage: filterData.page < Math.ceil(totalProjects / filterData.limit),
                hasPrevPage: filterData.page > 1,
            }
            result.project = project
            result.pageInfo = pageInfo
        }
        // Returning a 200 OK response with project data
        res.status(200).json({data: result, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = get