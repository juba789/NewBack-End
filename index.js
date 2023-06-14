require('dotenv').config()
const express =require("express")
const app = express()
const cors =require("cors")
const bodyParser = require('body-parser')
const path = require("path")
const port =3000

//Connection to database
require("./mongo")

//Controllers
const {CreateUser,LogUser}= require("./controllers/users")
const {getSauces,createSauce}=require("./controllers/sauces")


//Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//app.use(express.static(path.join(__dirname,'images')))
const {authenticateUser} =require("./middleware/auth")
const multer=require("multer")

const storage = multer.diskStorage({
    destination: "images/",
    filename: function (req, file, cb) {
      cb(null,makeFileName(req,file))
    }
  })

  function makeFileName(req,file){
    const fileName=`${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
    file.fileName=fileName
    return fileName
  }

  const upload =multer({storage:storage})


//Routes
app.post("/api/auth/signup",CreateUser) 
app.post("/api/auth/login",LogUser)
app.get("/api/sauces",authenticateUser,getSauces)
app.post("/api/sauces",authenticateUser,upload.single("image"), createSauce)
app.get("/", (req,res)=>res.send("h"))

//Listen
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => console.log("listening on port " + port));

