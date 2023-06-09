const express =require("express")
const app = express()
const cors =require("cors")
const port =3000

//Connection to database
require("./mongo")

//Controllers
const {CreateUser}= require("./controllers/users")


//Middleware
app.use(cors())
app.use(express.json())

//Routes
app.post("/api/auth/signup",CreateUser) 
app.get("/", (req,res)=>res.send("h"))

//Listen
app.listen(port, () => console.log("listening on port " + port));

