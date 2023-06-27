const mongoose = require('mongoose');
const uniqueValidator  =  require ( 'mongoose-unique-validator' )

// Récupération du mot de passe et du nom d'utilisateur depuis les variables d'environnement
const password =process.env.DB_PASSWORD
const username =process.env.DB_USER

// Construction de l'URI de connexion à la base de données MongoDB
const uri = `mongodb+srv://${username}:${password}@cluster0.ekur2as.mongodb.net/?retryWrites=true&w=majority`;

// Connexion à la base de données MongoDB
mongoose
 .connect(uri)
 .then(()=>console.log("connected to mongo"))
 .catch((err)=>console.error("Error  connecting to mongo:",err))

// Définition du schéma de l'utilisateur
const UserSchema = new mongoose.Schema({
  email:{ type:String,required:true,unique:true },
  password:{ type:String,required:true }
})

// Utilisation du plugin uniqueValidator pour vérifier l'unicité de l'email
UserSchema.plugin(uniqueValidator)

// Création du modèle "User" à partir du schéma défini
const User =mongoose.model("User",UserSchema)

module.exports={mongoose,User}


