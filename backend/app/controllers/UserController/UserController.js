const UserModel = require("../../model/User");
const UserService = require("../../service/UserService")
const userController = {
    /**
     * @desc get function called by route to get single or paginate user
     * @param {Object} req - request object
     * @param {Object} res - response object
     * @access - private
     */
    get: async (req, res) => {
        try {
            const filterData = {
                id: req.query.id,
                keyword: req.query.keyword ?? '',
                page: req.query.page ?? 1,
                limit: req.query.limit ?? 50,
                skip: (this.page - 1) * this.limit,
            }
            // Finding labels
            let user = null
            if (filterData?.id) {
                user = await UserModel.findById(filterData.id).exec()
                user = UserService.parseData(user)
            } else {
                user = await UserModel.find(
                    {
                        name: {$regex: new RegExp(filterData.keyword, 'i')},
                        _id: {$ne: req.sessionUser._id}
                    },
                    [],
                    {skip: filterData.skip, limit: filterData.limit}
                ).exec();
                await user.forEach((u) => {
                    u.avatarFullPath = process.env.APP_URL +'/uploads/'+ u?.avatar
                })
            }
            // Returning a 200 OK response with user data
            res.status(200).json({data: user, status: 'ok'});
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
}

module.exports = userController;