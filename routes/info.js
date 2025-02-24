const {Router} = require('express');
const router = Router();

//modelo
const InfoDog = require('../models/InfodogModel'); //modelo de usuario


//ruta de todo lo que hay en raza de perros
router.get('/infodogs',async(req,res)=>{
    try{
        // Buscar las razas disponibles en la base de datos
        const guias = await InfoDog.find();
        res.status(200).json(guias);

    }catch(error){
        res.status(500).send("No se pudieron obtener las guias"+ error.message);
    }
});

//rutas de usuarios
router.get('/infodogs/:raza',async(req,res)=>{
    try{
        // Obtener el nombre del parámetro en la URL
        const razaPerro = req.params.raza;

        // Buscar el usuario en la base de datos por el nombre
        const guia = await InfoDog.findOne({ raza: razaPerro });

        // Verificar si se encontró el usuario
        if (!guia) {
            return res.status(404).json({ mensaje: 'Guia de cuidado no encontrada' });
        }

        // Devolver el usuario encontrado como respuesta
        res.status(200).json(guia);

    }catch(error){
        res.status(500).send("No se pudo obtener la informacion del perro "+ error.message);
    }
});

module.exports = router;