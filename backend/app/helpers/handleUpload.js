const path = require("path")
const fs = require('fs');

const handleUpload = {
    uploadFile: async (file)  => {
        const fileExt = path.extname(file.name)
        const fileNewName = file.name.replace(fileExt, '').toLowerCase().split(' ').join('-') + '-' + Date.now();
        const fileName = fileNewName + fileExt;
        // Ensure the upload directory exists
        if (!fs.existsSync('./uploads/')) {
            fs.mkdirSync('./uploads/', { recursive: true });
        }
        const uploadPath = './uploads/' + fileName;
        await file.mv(uploadPath)
        return fileName
    }
};
module.exports = handleUpload;