const {User} =require("../mongo") 
const bcrypt = require('bcrypt')
const jwt= require('jsonwebtoken')

//Fonction de création d'un utilisateur
async function CreateUser(req, res) {
  const { email,password } = req.body
  const hashedPassword = await hashPassword(password)
  const user = new User({
    email: email,
    password: hashedPassword
  })
  user
    .save()
    .then(() => res.status(201).send({ message: "utilisateur enregistré" }))
    .catch((err) => res.status(409).send({ message: "utilisateur non enregistré :" + err }))
}

//Fonction pour hacher le mot de passe
function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds)
}

//Fonction de connection d'un utilisateur
async function LogUser(req, res) {
  try {
    const email = req.body.email
    const password = req.body.password
    const user = await User.findOne({ email: email })
    const isPasswordOk = await bcrypt.compare(password, user.password)
    if (!isPasswordOk) {
      res.status(403).send({
        message: "mot de passe incorrecte"
      })
    }
    const token = createToken(user._id)
    res.status(200).send({
      userId: user._id,
      token: token
    })
  } catch (err) {
    console.error(err)
    res.status(500).send({
      message: "erreur interne"
    })
  }

}

//Fonction pour créer un jeton JWT
function createToken(userId) {
  const jwtPassword = process.env.JWT_PASSWORD
  const token = jwt.sign({ userId: userId }, jwtPassword, { expiresIn : "24h" })
  return token
}
module.exports = {CreateUser,LogUser}

