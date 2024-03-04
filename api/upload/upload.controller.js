const path = require("path");
const { customErrorHandler } = require("../../helpers/error.helper");
const fs = require("fs");


exports.uploadImage = async function(req,res){
    try{
        let filename = Date.now();
        let format = req.files.file.mimetype.split("/")[1];
        let filePath = path.join(ROOTPATH, 'images/project', filename + "." +
            format);

        fs.writeFileSync(filePath, req.files.file.data);
        
        let result = filename + "." + req.files.file.mimetype.split(
            "/")[1]

        res.json({result: result})
    }catch (e) {
        const statusCode = await customErrorHandler(e.message)

        res.status(statusCode).send({
            success: false,
            message: e.message,
        })
    }
}