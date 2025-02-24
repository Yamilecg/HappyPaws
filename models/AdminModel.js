///ESQUEMA DE LOS USUARIOS
const {Schema,model} = require('mongoose');

//esquema de los usuarios
const adminShema = new Schema({
    nombre: {
        type: String,
        required: true
    },  
    ocupacion: {
        type: String,
        required: true
    },
    domicilio: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    edad:{
        type:Number,
        required: true
    },
    fechaDeNacimiento:{
        type:String,
        required:true
    }
});

//crear modelo de los usuarios
module.exports = model("Admin",adminShema);
