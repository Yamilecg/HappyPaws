///imports
const bcrypt = require("bcrypt");

///ESQUEMA DE LOS USUARIOS
const {Schema,model} = require('mongoose');

//esquema de los usuarios
const userShema = new Schema({
    nombre: {
        type: String,
        required: true
    },  
    apellidos: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true
    },
    contra: {
        type: String,
        required: true
    },
    perrosDadosEnAdopcion:{
        type:[String],
        required: true
    },
    verificado:{
        type:Boolean,
        required:true
    }
});

//encriptamos la contra
userShema.methods.encriptarContra = (contra)=>{
    let hash = bcrypt.hashSync(contra,10);
    //regresamos la contra cifrada
    return hash;
}

userShema.methods.compararContra = function(contra){
    //comparamos si la contra que nos pasan es la misma
    //retornamos true o false
    return bcrypt.compareSync(contra,this.contra);
}

//crear modelo de los usuarios
module.exports = model("User",userShema);
