const {app,express} =require("./server")
const {sauceRouter}=require("./routers/sauces.router")
const {authRouter}=require("./routers/auth.router")
const bodyParser = require('body-parser')
const path = require("path")
const port =3000

//Connection to database
require("./mongo")

app.use(bodyParser.urlencoded({extended:true}))

//Middleware
app.use(bodyParser.json())
app.use("/api/sauces",sauceRouter)
app.use("/api/auth",authRouter)


app.get("/", (req,res)=>res.send("h"))

//Listen
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => console.log("listening on port " + port));

