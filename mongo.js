
const mongoose = require('mongoose');
const password ="HgIbXv67HkdxU0KQ"
const uri = `mongodb+srv://juba78:${password}@cluster0.ekur2as.mongodb.net/?retryWrites=true&w=majority`;
mongoose
 .connect(uri)
 .then(()=>console.log("connected to mongo"))
 .catch((err)=>console.error("Error  connecting to mongo:",err))

 const UserSchema = new mongoose.Schema({
    email:String,
    password:String
 })
 const User =mongoose.model("User",UserSchema)

 module.exports={mongoose,User}
