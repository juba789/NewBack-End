const express =require("express")
const {getSauces,createSauce,getSauceById,deleteSauce,modifySauce}=require("../controllers/sauces")
const {authenticateUser} =require("../middleware/auth")
const {upload}=require("../middleware/multer")
const sauceRouter =express.Router()

sauceRouter.get("/",authenticateUser,getSauces)
sauceRouter.post("/",authenticateUser,upload.single("image"), createSauce)
sauceRouter.get("/:id",authenticateUser,getSauceById)
sauceRouter.delete("/:id",authenticateUser,deleteSauce)
sauceRouter.put("/:id",authenticateUser,upload.single("image"),modifySauce)

module.exports ={sauceRouter}