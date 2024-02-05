const TaskModel = require("../../../model/Task");

const get = async (req, res) => {
    try {
        const filterData = {
            keyword: req.query.keyword ?? '',
            status: req.query.status ?? null,
            label: req.query.label ?? null,
            priority: req.query.priority ?? null,
            state: req.query.state ?? null,
            assignee: req.query.assignee ?? null,
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50,
            skip: ((req.query.page ?? 1) - 1) * (req.query.limit || 50),
        }
        let task = null
        let result = {}
        let matchCondition = {
            deleted_at: {$eq: null},
            name: {$regex: new RegExp(filterData.keyword, 'i')},
        };
        if (filterData.status) {
            filterData.status = filterData.status.split(',')
            matchCondition['status'] = {$in: filterData.status};
        }
        if (filterData.priority) {
            filterData.priority = filterData.priority.split(',')
            matchCondition['priority'] = {$in: filterData.priority};
        }
        if (filterData.state) {
            filterData.state = filterData.state.split(',')
            matchCondition['state_id'] = {$in: filterData.state};
        }
        if (filterData.label) {
            filterData.label = filterData.label.split(',')
            matchCondition['label_id'] = { $elemMatch: {$in: filterData.label}};
        }
        if (filterData.assignee) {
            filterData.assignee = filterData.assignee.split(',')
            matchCondition['assignee'] = { $elemMatch: {$in: filterData.assignee}};
        }
        task = await TaskModel.aggregate([
            {
                $match: matchCondition,
            },
            {$sort: {created_at: -1}},
            {
                $project: {
                    'name': 1,
                    'description': 1,
                    'label_id': 1,
                    'state_id': 1,
                    'status': 1,
                    'priority': 1,
                    'assignee': 1,
                    'creator_id': 1,
                }
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
                    'label_as_objectId': {
                        $map: {
                            input: "$label_id",
                            as: "labelId",
                            in: { $toObjectId: "$$labelId" },
                        },
                    },
                    'state_objectId': {
                        $toObjectId: "$state_id"
                    }
                }
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
                    as: "user"
                },
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
            {$skip: filterData.skip},
            {$limit: filterData.limit}
        ]).exec();
        const totalProjects = await TaskModel.countDocuments({
            $and: [matchCondition],
        });
        let pageInfo = {
            totalData: totalProjects,
            totalPages: Math.ceil(totalProjects / filterData.limit),
            hasNextPage: filterData.page < Math.ceil(totalProjects / filterData.limit),
            hasPrevPage: filterData.page > 1,
        }
        result.task = task
        result.pageInfo = pageInfo
        // Returning a 200 OK response with project data
        res.status(200).json({data: result, status: 'ok'});
    } catch (error) {
        res.status(500).send(error.message);
    }
}

module.exports = get