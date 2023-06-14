const bodyParser = require('body-parser')
const {app,express} =require("./server")
const path = require("path")
const port =3000

//Connection to database
require("./mongo")

//Controllers
const {CreateUser,LogUser}= require("./controllers/users")
const {getSauces,createSauce,getSauceById}=require("./controllers/sauces")



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Middleware
const {upload}=require("./middleware/multer")
const {authenticateUser} =require("./middleware/auth")

//Routes
app.post("/api/auth/signup",CreateUser) 
app.post("/api/auth/login",LogUser)
app.get("/api/sauces",authenticateUser,getSauces)
app.post("/api/sauces",authenticateUser,upload.single("image"), createSauce)
app.get("/api/sauces/:id",authenticateUser,getSauceById)
app.get("/", (req,res)=>res.send("h"))

//Listen
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => console.log("listening on port " + port));

