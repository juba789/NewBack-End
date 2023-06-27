const jwt = require('jsonwebtoken')

// Fonction d'authentification de l'utilisateur
function authenticateUser(req, res, next) {
	const header = req.header("Authorization")
	if(header == null) return res.status(403).send({ message: "invalide" })
	const token = header.split(" ")[1]
	if(token == null) return res.status(403).send({ message: "le token ne peut être nul" })
	jwt.verify(token, process.env.JWT_PASSWORD, (err, decoded) => {
		if(err) return res.status(403).send({ message: "token invalide" + err })
		next()
	})
}

module.exports = { authenticateUser }
  
  
      