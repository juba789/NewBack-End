const {User} =require("../mongo") 
const bcrypt = require('bcrypt')

async function CreateUser(req,res){
    const {email,password}=req.body

    const hashedPassword= await hashPassword(password)

    const user = new User({email:email,password:hashedPassword})
     user
     .save()
     .then(()=>res.status(201).send({message:"utilisateur enregistré"}))
     .catch((err)=>res.status(409).send({message:"utilisateur non enregistré :"+err}))
    
}

function hashPassword(password){
    const saltRounds = 10;
    return bcrypt.hash(password,saltRounds)
    
}
function LogUser(req,res){
const email = req.body.email
const password =req.body.password
}

module.exports = {CreateUser,LogUser}