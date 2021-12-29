const path = require('path')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const uploadProductImageLocal = async (req,res) => {
    //console.log(req.files);
if(!req.files){
    throw new CustomError.BadRequestError('No file provided')
}
const productImage = req.files.image
if(!productImage.mimetype.startsWith('image')){
    throw new CustomError.BadRequestError('Please Upload Image')
}
const maxSize = 1024 * 1024
if(productImage.size > maxSize){
    throw new CustomError.BadRequestError(`Please Upload Image smaller than 1 MB`)
}
const imagePath = path.join(
 __dirname,'../public/uploads/' + `${productImage.name}`
)
await productImage.mv(imagePath)
return res
.status(StatusCodes.OK)
.json({image:{src:`/uploads/${productImage.name}`}})
}

const uploadProductImage = async (req,res) => {
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,{
            use_filename: true,
            folder: 'file-upload(test)'
        })
        
      fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({image:{src: result.secure_url}})
        }

module.exports = {
    uploadProductImage,
}



