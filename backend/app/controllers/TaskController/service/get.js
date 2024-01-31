const TaskModel = require("../../../model/Task");

const get = async (req, res) => {
    try {
        const filterData = {
            keyword: req.query.keyword ?? '',
            status: req.query.status ?? [],
            label: req.query.label ?? [],
            priority: req.query.priority ?? [],
            state: req.query.state ?? [],
            assignee: req.query.state ?? [],
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 50,
            skip: ((req.query.page ?? 1) - 1) * (req.query.limit || 50),
        }
        let task = null
        let result = {}
        let matchCondition = {
            deleted_at: {$eq: null},
            name: {$regex: new RegExp(filterData.keyword, 'i')},
            // status: {$in: filterData.status},
            // label: {$in: filterData.label},
            // priority: {$in: filterData.priority},
            // state: {$in: filterData.state},
            // assignee: {
            //     $elemMatch: {$in: filterData.assignee}
            // }
        };
        task = await TaskModel.aggregate([
            {
                $match: matchCondition,
            },
            {$sort: {created_at: -1}},
            {
                $project: {
                    'name': 1,
                    'description': 1,
                    'label': 1,
                    'state': 1,
                    'status': 1,
                    'priority': 1,
                    'assignee': 1,
                    'creator_id': 1,
                }
            },

            // {
            //     $addFields: {
            //         'assignee_as_objectId': {
            //             $map: {
            //                 input: "$assignee",
            //                 as: "assigneeId",
            //                 in: { $toObjectId: "$$assigneeId" },
            //             },
            //         }
            //     }
            // },
            // {
            //     $lookup: {
            //         from: "users",
            //         localField: "assignee_as_objectId",
            //         foreignField: "_id",
            //         as: "users"
            //     }
            // },
            // {
            //     $unwind: "$users"
            // },
            // {
            //     $addFields: {
            //         user: {
            //             $mergeObjects: [
            //                 "$user",
            //                 {
            //                     avatarFullPath: {
            //                         $cond: {
            //                             if: {$ne: ['$user.avatar', null]},
            //                             then: {$concat: [process.env.APP_URL, '/uploads/', '$user.avatar']},
            //                             else: null
            //                         }
            //                     }
            //                 }
            //             ]
            //         }
            //     }
            // },
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