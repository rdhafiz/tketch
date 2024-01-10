const Validator = {
    parseError: (error) => {
        let regexPattern = /\\|\"/g;
        let fails = {};
        error.details.forEach((v, i) => {
            fails[v.path[0]] = v.message.replace(regexPattern, '');
        })
        return fails;
    }
}
module.exports = Validator