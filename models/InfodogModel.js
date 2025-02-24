///ESQUEMA DE LOS USUARIOS
const {Schema,model} = require('mongoose');

//esquema de los usuarios
let infodogSchema = new Schema({
    raza:{
        type:String,
        required:true
    },
    personalidad: {
        type: String,
        required: true
    },
    salud: {
        type: String,
        required: true
    },
    ejercicio: {
        type: String,
        required: true
    },
    nutricion: {
        type: String,
        required: true
    },
    imagen1: {
        type: String,
        required: true
    },
    imagen2: {
        type: String,
        required: true
    }
});
//crear modelo de los usuarios
module.exports = model("InfoDog",infodogSchema);
