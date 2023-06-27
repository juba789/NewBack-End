const multer=require("multer")

// Configuration du stockage pour les fichiers multer
const storage = multer.diskStorage({
  destination: "images/",
  filename: function (req, file, cb) {
      cb(null,makeFileName(req,file))
  }
})

// Fonction pour générer un nom de fichier unique
function makeFileName(req,file){
  const fileName=`${Date.now()}-${file.originalname}`.replace(/\s/g,"-")
  file.fileName=fileName
  return fileName
}

const upload =multer({storage})

module.exports={ upload }