const {Router} = require('express');
const multer = require('multer');
const router = Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,"./assets/img/uploadedDogs");
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
});

//instanciamos nuestro multer con la configuracion que le dimos
const upload = multer({storage:storage});

//ruta para subir archivos
router.post('/upload',upload.single('archivo'),(req,res)=>{
    const originalname = req.file.originalname
    const rutaFinal = path.join(originalname);
    //mandamos la ruta del archivo
    res.send(rutaFinal);
});

module.exports = router;
