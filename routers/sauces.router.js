// Import des modules nécessaires
const express =require("express")
const {getSauces,createSauce,getSauceById,deleteSauce,modifySauce,likeSauce}=require("../controllers/sauces")
const {authenticateUser} =require("../middleware/auth")
const {upload}=require("../middleware/multer")
// Création du routeur pour les sauces
const sauceRouter =express.Router()

//Définition des routes pour les sauces avec leurs middlewares respectifs
sauceRouter.get("/",authenticateUser,getSauces)
sauceRouter.post("/",authenticateUser,upload.single("image"), createSauce)
sauceRouter.get("/:id",authenticateUser,getSauceById)
sauceRouter.delete("/:id",authenticateUser,deleteSauce)
sauceRouter.put("/:id",authenticateUser,upload.single("image"),modifySauce)
sauceRouter.post("/:id/like",likeSauce)

//Export du routeur des sauces
module.exports ={sauceRouter}