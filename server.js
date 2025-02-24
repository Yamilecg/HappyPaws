const express = require('express');
//necesitamos nuestra base de datos
require("./database");
//inicilizamos multer

//evitar cors
const cors = require("cors");

//crear servidor
const app = express();

//middlewares
app.use(cors());
//middlewares
app.use(cors());
app.use(express.json());
app.use(require("./routes/archivos"));
app.use(express.json());

//routes
app.use(require("./routes/dogs"));
app.use(require("./routes/users"));
app.use(require("./routes/info"));
app.use(require("./routes/admin"));


//inicializar
app.listen(3000,()=>{
    console.log("Servidor en funcionamiento");
})

module.exports = app;