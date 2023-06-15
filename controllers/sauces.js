const mongoose = require("mongoose")
const unlink=require("fs").promises.unlink


const productSchema =new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})
const Product = mongoose.model("Product",productSchema)


function getSauces(req,res){
     Product.find({})
     .then(products=>res.send(products))
     .catch(error=>res.status(500).send(error))
    }

function getSauceById(req,res){
    const{id}=req.params 
    Product.findById(id)
       .then((product)=>res.send(product))
       .catch(console.error)
}

function deleteSauce(req,res){
const{id}=req.params
Product.findByIdAndDelete(id)
//.then(deleteImage)
.then(product=>sendClientResponse(product,res))
.catch(err=>res.status(500).send({message:err}))
}

/*function deleteImage(product){
const {imageUrl}=product
const fileToDelete=imageUrl.split("/").at(-1)
 return unlink(`images/${fileToDelete}`).then(()=>product)
}*/

function modifySauce(req,res){
    const {params:{id}}=req
    const {body}=req
    console.log("body et id",body,id)
    Product.findByIdAndUpdate(id,body)
    .then((dbResponse)=>sendClientResponse(dbResponse,res))
    .catch((err)=>console.error("MAUVAIS UPDATING",err))
}

function sendClientResponse(product,res){
    
        if(product == null){
            console.log("nothing updated")
          return   res.status(404).send({message:"object not found in database"})
        }   
            console.log("bon updating",product)
            res.status(200).send({message:"succes updated"})
        
    
}


function createSauce(req,res){
    const{body,file}=req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    
    function makeImageUrl(req, fileName) {
        return req.protocol + "://" + req.get("host") + "/images/" + fileName
      }
    
const product = new Product({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl:makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []  
})

product
.save()
.then((message) => res.status(201).send({ message }))
.catch((err) => res.status(500).send(err))
}

module.exports={getSauces,createSauce,getSauceById,deleteSauce,modifySauce}