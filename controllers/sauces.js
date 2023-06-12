const jwt= require('jsonwebtoken')

function getSauces(req,res){
const header =req.header("Authorization") 
if (header==null) return res.status(403).send({message:"invalid"})
const token =header.split(" ")[1]
if(token==null)  return res.status(403).send({message:"token cannot be null"})
jwt.verify(token,process.env.JWT_PASSWORD,(err,decoded)=>handleToken(err,decoded,res))
}

function handleToken(err,decoded,res){
if(err) res.status(403).send({message:"token invalid"+err})
else{
    console.log("le token est bon:",decoded)
    res.send({message:[{sauce:"sauce1"},{sauce:"sauce2"}]})
}
}

module.exports={getSauces}