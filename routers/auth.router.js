// Importation des modules nécessaires
const {CreateUser,LogUser}= require("../controllers/users")
const express =require("express")
const authRouter =express.Router()

// Définition des routes d'authentification
authRouter.post("/signup",CreateUser) 
authRouter.post("/login",LogUser)

//// Exportation du routeur d'authentification
module.exports={authRouter}