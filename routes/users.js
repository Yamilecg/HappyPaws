const {Router} = require('express');
const router = Router();

//modelo
const User = require('../models/UserModel'); //modelo de usuario

//rutas de usuarios
router.get('/users',async(req,res)=>{
    try{
        const usuarios = await User.find();
        res.status(200).json(usuarios);
    }catch(error){
        res.status(500).send("No se pudieron obtener los usuarios "+ error.message);
    }
});

router.get('/users/:correo',async(req,res)=>{
    try{
        //obtenemos el correo del usuario que nos pasen
        const correo = req.params.correo;

        //buscamos el correo para ver si tenemos en la database
        const usuario = await User.findOne({correo:correo});

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

router.get('/users/:correo/:contra',async(req,res)=>{
    try{
        //obtenemos el correo y contra del usuario que nos pasen
        const correo = req.params.correo;
        const contra = req.params.contra;

        //buscamos el correo para ver si tenemos en la database
        const usuario = await User.findOne({correo:correo});
        
        //verificar si encontramos el usuario
        if(!usuario){
            return res.status(404).json({mensaje:"Usuario no encontrado"});

        //si encontramos al usuario vemos si la contra que nos pasan es la correcta
        }else{
            if(usuario.compararContra(contra)){
                //si nos regresa true es que la contra es correcta tons devolvemos el usuario
                res.status(200).json(usuario);
            }else{
                //la contra que nos pasaron es erroneo
                res.status(500).send("Usuario y contras no coinciden");
            }
        }
    }catch(error){
        res.status(500).send("Error al obtener el usuario"+error.message);
    }
});

router.post('/users',async(req,res)=>{
    try{
        //se crea el cuerpo del nuevo usuario a guardar
        let nuevoUsuario = new User({
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            correo: req.body.correo,
            contra: req.body.contra,
            perrosDadosEnAdopcion: req.body.perrosDadosEnAdopcion,
            verificado:req.body.verificado
        });
        //encriptamos la contra
        let contraEncriptada = nuevoUsuario.encriptarContra(req.body.contra);
        //asiganmos la nueva contra
        nuevoUsuario.contra = contraEncriptada; 

        //lo guardamos en la base de datos
        let usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    }catch(error){
        res.status(400).send(error);
    };
});

///metodo para actualizar el verificado
router.put('/users/:correo', async (req, res) => {
    const correo = req.params.correo;

    try {
        const actualizarUsuario = await User.findOneAndUpdate(
        { correo: correo },
        { $set: { verificado: true } },
        { new: true }
        );

        if (!actualizarUsuario) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(actualizarUsuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    });

// Ruta para actualizar la lista del usuario
router.put('/users/updateList/:correo', async (req, res) => {
    try {
        console.log("NUEVA LISTA"+req.body.perrosDadosEnAdopcion);
        const correo = req.params.correo;
        const nuevaLista = req.body.perrosDadosEnAdopcion;
        // Buscar y actualizar el usuario por correo
        const usuarioActualizado = await User.findOneAndUpdate(
        { correo: correo },
        { perrosDadosEnAdopcion: nuevaLista },
        { new: true } // Para obtener la versión actualizada del usuario después de la actualización
        );

        if (!usuarioActualizado) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuarioActualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

module.exports = router;
