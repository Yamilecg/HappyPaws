function validarnofalsos() {
    // Inicializar la variable salir
    let salir = false;

    // Obtener los inputs para ver si están vacíos o no
    let entradas = document.querySelectorAll('.input-upload');

    entradas.forEach((input) => {
        if (input.value === "") {
            salir = true;
        }
    });

    if (salir) {
        alert("Asegúrate de que todos los campos estén completos");
        return; // Salir del bucle si encontramos un input vacío
    }else{
        alert("Has sido verificado con exito");
        certificarUsuario();
    }
}


function certificarUsuario(){
     //obtenemos el correo del usuario que inicia sesion
    let correoUsuario = sessionStorage.getItem("correoUsuario");
    let usuarioACambiar = {} 

    ///hacemos una llamada al servidor para ver si el usuario ya esta verificado
    let xhr = new XMLHttpRequest();
    xhr.open("GET","http://localhost:3000/users/"+correoUsuario);
    xhr.send();
    xhr.onload = ()=>{
        //creamos el usuario nuevo a postear con el verificado en true
        let usuario = JSON.parse(xhr.response);
        usuarioACambiar = {
            nombre:usuario.nombre,
            apellidos:usuario.apellidos,
            correo:usuario.correo,
            contra:usuario.contra,
            perrosDadosEnAdopcion: usuario.perrosDadosEnAdopcion,
            verificado:usuario.true
        };
    };

    ///hacer una nueva llamda al servidor para poner los datos nuevos
    let xhr2 = new XMLHttpRequest();
    xhr2.open("PUT","http://localhost:3000/users/"+correoUsuario);
    xhr2.send(JSON.stringify(usuarioACambiar));
    alert("Ahora eres un usuario verificado");
    window.open("../views/loginIn.html","_self");
};
