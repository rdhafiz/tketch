const path = require("path")

const handleUpload = {
    uploadFile: async (file)  => {
        const fileExt = path.extname(file.name)
        const fileNewName = file.name.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
        const fileName = fileNewName + fileExt;
        const uploadPath = './uploads/' + fileName;
        await file.mv(uploadPath)
        return fileName
    }
};
module.exports = handleUpload;