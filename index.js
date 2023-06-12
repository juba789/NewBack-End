require('dotenv').config()
const express =require("express")
const app = express()
const cors =require("cors")
const port =3000

//Connection to database
require("./mongo")

//Controllers
const {CreateUser,LogUser}= require("./controllers/users")
const {getSauces}=require("./controllers/sauces")


//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.post("/api/auth/signup",CreateUser) 
app.post("/api/auth/login",LogUser)
app.get("/api/sauces",getSauces)
app.get("/", (req,res)=>res.send("h"))

//Listen
app.listen(port, () => console.log("listening on port " + port));

