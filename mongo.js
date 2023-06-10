
const mongoose = require('mongoose');
const uniqueValidator  =  require ( 'mongoose-unique-validator' )
const password =process.env.DB_PASSWORD
const username =process.env.DB_USER
const uri = `mongodb+srv://${username}:${password}@cluster0.ekur2as.mongodb.net/?retryWrites=true&w=majority`;
mongoose
 .connect(uri)
 .then(()=>console.log("connected to mongo"))
 .catch((err)=>console.error("Error  connecting to mongo:",err))

 const UserSchema = new mongoose.Schema({
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true}
 })
 UserSchema.plugin(uniqueValidator)

 const User =mongoose.model("User",UserSchema)

 module.exports={mongoose,User}
