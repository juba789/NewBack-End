const {CreateUser,LogUser}= require("../controllers/users")
const express =require("express")
const authRouter =express.Router()

authRouter.post("/signup",CreateUser) 
authRouter.post("/login",LogUser)

module.exports={authRouter}