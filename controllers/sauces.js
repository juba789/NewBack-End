const mongoose = require("mongoose")
const { unlink } = require("fs/promises")


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
.then(product=>sendClientResponse(product,res))
.then((item)=>deleteImage(item))
.then((res)=>console.log("FILE DELETED",res))
.catch(err=>res.status(500).send({message:err}))
}



/*function modifySauce(req,res){
    const {params:{id}}=req

    
    const hasNewImage = req.file != null
    const payload =makePayload(hasNewImage,req)
    

    Product.findByIdAndUpdate(id,payload)
    .then((dbResponse)=>sendClientResponse(dbResponse,res))
    .then((product)=>deleteImage(product))
    .then((res)=>console.log("FILE DELETED",res))
    .catch((err)=>console.error("MAUVAIS UPDATING",err))
}*/
function modifySauce(req, res) {
    const { params: { id } } = req;
    const hasNewImage = req.file != null;
    const payload = makePayload(hasNewImage, req);
  
    // Vérifier si une nouvelle image a été fournie
    if (hasNewImage) {
      Product.findById(id)
        .then((product) => {
          if (product == null) {
            console.log("Sauce not found");
            return res.status(404).send({ message: "Sauce not found in database" });
          }
          // Supprimer l'image précédente
          const imageToDelete = product.imageUrl.split("/").at(-1);
          return unlink("images/" + imageToDelete);
        })
        .then(() => {
          // Mettre à jour la sauce avec le nouveau payload
          return Product.findByIdAndUpdate(id, payload);
        })
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .catch((err) => {
          console.error("Error updating sauce:", err);
          return res.status(500).send({ message: "Error updating sauce" });
        });
    } else {
      // Aucune nouvelle image, mettre simplement à jour la sauce
      Product.findByIdAndUpdate(id, payload)
        .then((dbResponse) => sendClientResponse(dbResponse, res))
        .catch((err) => {
          console.error("Error updating sauce:", err);
          return res.status(500).send({ message: "Error updating sauce" });
        });
    }
  }
  

function deleteImage(product){
if(product==null) return
const imageToDelete=product.imageUrl.split("/").at(-1)
 return unlink("images/"+imageToDelete)
}

function makePayload(hasNewImage,req){
    console.log("hasNewImage",hasNewImage)
    if(!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl=makeImageUrl(req,req.file.fileName)
    console.log("VOICI LE PAYLOAD:",payload)
    return payload
}

function sendClientResponse(product,res){
    
        if(product == null){
            console.log("nothing updated")
          return   res.status(404).send({message:"object not found in database"})
        }   
            console.log("bon updating",product)
           return Promise.resolve(res.status(200).send({message:"succes updated"})).then(()=>product)
        
    
}
function makeImageUrl(req, fileName) {
    return req.protocol + "://" + req.get("host") + "/images/" + fileName
  }

function createSauce(req,res){
    const{body,file}=req
    const { fileName } = file
    const sauce = JSON.parse(body.sauce)
    const { name, manufacturer, description, mainPepper, heat, userId } = sauce
    
    
    
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