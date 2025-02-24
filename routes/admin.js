const {Router} = require('express');
const router = Router();

//modelo
const Admin = require('../models/AdminModel'); //modelo de usuario

//rutas de usuarios
router.get('/admins',async(req,res)=>{
    try{
        const usuarios = await Admin.find();
        res.status(200).json(usuarios);
    }catch(error){
        res.status(500).send("No se pudieron obtener los usuarios admins"+ error.message);
    }
});

//encontrar un admin user por su id
router.get('/admins/:id',async(req,res)=>{
    try{
        //obtenemos el correo del usuario que nos pasen
        const id = req.params.id;

        //buscamos el correo para ver si tenemos en la database
        const usuario = await Admin.findOne({_id:id});

        //verificar si encontramos el usuario
        if(!usuario){
            return res.status(404).json({mensaje:"Usuario no encontrado"});
        }

        //devolvemos el usuario encontrado
        res.status(200).json(usuario);
    }catch(error){
        res.status(500).send("Error al obtener el usuario"+error.message);
    }
});

router.post('/admins',async(req,res)=>{
    try{
        //se crea el cuerpo del nuevo usuario a guardar
        let nuevoUsuario = new Admin({
            nombre: req.body.nombre,
            ocupacion: req.body.ocupacion,
            domicilio:req.body.domicilio,
            telefono:req.body.telefono,
            edad:req.body.edad,
            fechaDeNacimiento:req.body.fechaDeNacimiento
        });
        //lo guardamos en la base de datos
        let usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    }catch(error){
        res.status(400).send(error);
    };
});

module.exports = router;

