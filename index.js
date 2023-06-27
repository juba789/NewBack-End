const {app,express} =require("./server")
const {sauceRouter}=require("./routers/sauces.router")
const {authRouter}=require("./routers/auth.router")
const bodyParser = require('body-parser')
const path = require("path")
const port =3000

//Connexion à la base de données
require("./mongo")

//Middleware
app.use(bodyParser.json())
app.use("/api/sauces",sauceRouter)
app.use("/api/auth",authRouter)

//Routes
app.get("/", (req,res)=>res.send("h"))

//Listen
app.use("/images",express.static(path.join(__dirname,"images")))
app.listen(port, () => console.log("listening on port " + port));

