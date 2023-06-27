const mongoose = require("mongoose")
const { unlink } = require("fs/promises")

//Définition du schéma du produit
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

//Récupère toutes les sauces
function getSauces(req, res) {
  Product.find({})
    .then(products => res.send(products))
    .catch(error => res.status(500).send(error))
}

//Récupère une sauce spécifique par son ID
function getSauce(req, res) {
  const { id } = req.params
  return Product.findById(id)
}

//Récupère une sauce spécifique par son ID et envoie la réponse au client
function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

//Fonction de Suppression d'une sauce spécifique par son ID et de l'image associée
function deleteSauce(req, res) {
  const { id } = req.params
  Product.findByIdAndDelete(id)
    .then(product => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("fichier supprimé", res))
    .catch(err => res.status(500).send({ message: err }))
}

//Foction qui Modifie une sauce spécifique par son ID
function modifySauce(req, res) {
  const { params: { id } } = req;
  const hasNewImage = req.file != null;
  const payload = makePayload(hasNewImage, req);

  if (hasNewImage) {
    Product.findById(id)
      .then((product) => {
        if (product == null) {
          console.log("Sauce not found");
          return res.status(404).send({
            message: "Sauce introuvable dans la base de donnée"
          });
        }

        const imageToDelete = product.imageUrl.split("/").at(-1);
        return unlink("images/" + imageToDelete);
      })
      .then(() => {

        return Product.findByIdAndUpdate(id, payload);
      })
      .then((dbResponse) => sendClientResponse(dbResponse, res))
      .catch((err) => {
        console.error("Error updating sauce:", err);
        return res.status(500).send({
          message: "Erreur lors de la mise à jour de la sauce"
        });
      });
  } else {

    Product.findByIdAndUpdate(id, payload)
      .then((dbResponse) => sendClientResponse(dbResponse, res))
      .catch((err) => {
        console.error("Error updating sauce:", err);
        return res.status(500).send({
          message: "Erreur lors de la mise à jour de la sauce"
        });
      });
  }
}

//Fonction qui supprime l'image associée au produit
function deleteImage(product) {
  if (product == null) return
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}

//Crée le payload pour la modification de la sauce
function makePayload(hasNewImage, req) {
  if (!hasNewImage) return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  return payload
}

//Fonction d'envoie de la réponse au client
function sendClientResponse(product, res) {
  if (product == null) {
    return res.status(404).send({
      message: "Produit introuvable dans le base de donnée"
    })
  }
  return Promise.resolve(res.status(200).send(product)).then(() => product)
}

//Fonction de création de l'URL complète avec le nom du fichier de l'image
function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

//Fonction pour créer une nouvelle sauce
function createSauce(req,res){
  const{body,file}=req
  const { fileName } = file
  const sauce = JSON.parse(body.sauce)
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce

  //Création d'une nouvelle instance de Product avec les données de la sauce
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

 // Sauvegarde du produit dans la base de données
product
  .save()
  .then((message) => res.status(201).send({ message }))
  .catch((err) => res.status(500).send(err))
}

//Fonction de gestion des likes et des dislikes d'une sauce
function likeSauce(req, res) {
  const like = req.body.like
  const userId = req.body.userId

  if (![-1, 0, 1].includes(like)) return res.status(403).send({ message: "like invalide" })
  getSauce(req, res)
    .then((product) => updateVote(product, like, userId, res))
    .then((pr) => pr.save())
    .then((prod) => sendClientResponse(prod, res))
    .catch((err) => res.status(500).send(err))
}

//Fonction qui Met à jour les votes de la sauce en fonction de l'option "like"
function updateVote(product,like,userId,res){
if(like ===1 || like ===-1) return incrementVote(product,userId,like)
return resetVote(product,userId,like,res)
}

//Fonction de réinitialisation des votes d'une sauce
function resetVote(product, userId, res) {
  const { usersLiked,usersDisliked } = product

  if ([usersLiked, usersDisliked].every(arr => arr.includes(userId)))
     return Promise.reject("l'utilisateur a voté dans les deux sens")

  if (![usersLiked, usersDisliked].some(arr => arr.includes(userId)))
     return Promise.reject("l'utilisateur n'a pas encore voté")

  if (usersLiked.includes(userId)) {
     --product.likes
     product.usersLiked = product.usersLiked.filter(id => id !== userId)
  } else {
     --product.dislikes
     product.usersDisliked = product.usersDisliked.filter(id => id !== userId)
  }

  return product
}

//Incrémente les votes d'une sauce
function incrementVote(product, userId, like) {
  const { usersLiked,usersDisliked } = product
  const votersArray = like === 1 ? usersLiked : usersDisliked

  if (votersArray.includes(userId)) return product
  votersArray.push(userId)

  like === 1 ? ++product.likes : ++product.dislikes

  return product
}

module.exports={getSauces,createSauce,getSauceById,deleteSauce,modifySauce,likeSauce}








	
	
	

	





	