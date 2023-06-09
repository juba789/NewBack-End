const {User} =require("../mongo") 


function CreateUser(req,res){
    const {email,password}=req.body
    const user = new User({email:email,password:password})
     user
     .save()
     .then(()=>res.send({message:"utilisateur enregistré"}))
     .catch(err=>console.log("User pas enregistré",err))
    
}

module.exports = {CreateUser}