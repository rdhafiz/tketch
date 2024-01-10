const UserService = {
    parseData: (user) => {
        return {
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
        }
    }
}
module.exports = UserService