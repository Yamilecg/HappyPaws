///imports
const bcrypt = require("bcrypt");

///ESQUEMA DE LOS USUARIOS
const {Schema,model} = require('mongoose');

//esquema de los usuarios
const dogSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: true
    },
    raza: {
        type: String,
        required: true
        },
    color: {
        type: String,
        required: true
    },
    energia: {
        type: Number,
        required: true
    },
    historialMedico: {
        type: [String],
        required: true
    },
    problemasSalud: {
        type: [String],
        required: true
    },
    medicamentos: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    }
});

//crear modelo de los usuarios
module.exports = model("Dog",dogSchema);
