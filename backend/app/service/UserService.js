const avatarFullPath = (avatar) => {
    if (avatar) {
        return process.env.APP_URL +'/uploads/'+avatar;
    }
    return null;
}

const UserService = {
    parseData: (user) => {
        if (user) {
            return {
                _id: user._id,
                avatar: user.avatar,
                avatarFullPath: avatarFullPath(user.avatar),
                name: user.name,
                email: user.email,
                color: user.color,
            }
        } else {
            return null
        }
    },
}
module.exports = UserService