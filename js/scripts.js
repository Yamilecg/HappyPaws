window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.add('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

function cambiarHome() {
    // Obtén los elementos de input
    const inputCorreo = document.getElementById("input-correo-iniciar-sesion");
    const inputContra = document.getElementById("contra-iniciar-sesion");

    // Obtén el valor de los inputs
    const correoUsuario = inputCorreo.value;
    const contraUsuario = inputContra.value;

    // Hacer una llamada al servidor usando fetch
    fetch(`http://localhost:3000/users/${correoUsuario}/${contraUsuario}`)
        .then(response => {
            console.log("EL STATUS DE LA LLAMADA ES: " + response.status);

            if (response.status === 200) {
                alert("Bienvenido");

                // Guardar en sessionStorage
                sessionStorage.setItem("correoUsuario", correoUsuario);
                sessionStorage.setItem("ListaImagenesPerros", JSON.stringify([]));

                // Redireccionar
                window.location.replace("loginIn.html");
            } else if (response.status === 404) {
                alert("Correo o contraseña incorrecta");
                inputCorreo.value = "";
                inputContra.value = "";
            } else {
                alert("Error inesperado al iniciar sesión");
                inputCorreo.value = "";
                inputContra.value = "";
            }
        })
        .catch(error => {
            console.error("Error al realizar la solicitud:", error);
            alert("Hubo un problema al conectar con el servidor.");
        });
}


function verificarse() {
    // Checamos si ya está verificado
    if (_checkVerification()) {
        alert("Usuario ya verificado");
    } else {
        // Obtenemos el correo del usuario que inició sesión
        let correoUsuario = sessionStorage.getItem("correoUsuario");
        // Hacemos una llamada al servidor para ver si el usuario ya está verificado
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/" + correoUsuario);
        xhr.send();
        xhr.onload = () => {
            let usuario = JSON.parse(xhr.response);
            if (usuario.verificado === true) {
                alert("Ya estas verificado");
            } else {
                window.open('certifiedUser.html', '_self');
            }
        };
    }
}

function darDeAltaUsuario(){
    //obtenemos todos los valores de los inputs
    let nombre = document.getElementById("nombreRegistro").value;
    let apellidos = document.getElementById("apellidosRegistro").value;
    let correo = document.getElementById("correoRegistro").value;
    let contra = document.getElementById("contraRegistro").value;

    //validamos si el correo tiene formato correcto
    const estructuraCorreo = /^[a-zA-Z0-9\.\_\-]+@[a-zA-Z]+.[a-zA-Z]+[a-zA-Z\.]*$/

    //validamos si no estan vacias los inputs
    if(nombre===""||apellidos===""||correo===""||contra===""){
        alert("Asegurate de llenar todos los campos");
    }


    //validamos si el formato del correo es correcto
    if(!estructuraCorreo.test(correo)){
        alert("Correo incorrecto");
        return;
    };
    

    const usuarioAPostear = 
    {
        nombre:nombre,
        apellidos:apellidos,
        correo:correo,
        contra:contra,
        perrosDadosEnAdopcion:[],
        verificado:false
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST",'http://localhost:3000/users');
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(usuarioAPostear));

    //limpiamos los inputs
    nombre="";
    apellidos="";
    correo="";
    contra="";

    //le decimos que todo fino
    alert("Usuario registrado con exito");
}

function checkVerificacion(){
    //obtenemos el correo del usuario que inicio sesion
    let correoUsuario = sessionStorage.getItem("correoUsuario");

    ///hacemos una llamada al servidor para ver si el usuario ya esta verificado
    let xhr = new XMLHttpRequest();
    xhr.open("GET","http://localhost:3000/users/"+correoUsuario);
    xhr.send();
    xhr.onload = () => {
        
        let usuario = JSON.parse(xhr.response);
        console.log(usuario.verificado)
        if(usuario.verificado === false){
            alert("Necesitas verificarte para poner en adopción a un perro");
            return false;
        }else{
            window.open('userAdoptions.html','_self');
        };
    };   
}

function _checkVerification(){
    //obtenemos el correo del usuario que inicio sesion
    let correoUsuario = sessionStorage.getItem("correoUsuario");

    ///hacemos una llamada al servidor para ver si el usuario ya esta verificado
    let xhr = new XMLHttpRequest();
    xhr.open("GET","http://localhost:3000/users/"+correoUsuario);
    xhr.send();
    xhr.onload = () => {
        let usuario = JSON.parse(xhr.response);
        console.log(usuario.verificado)
        if(usuario.verificado === false){
            return false;
        }else{
            return true;
        };
    };   
}

function cerrarSesion(){
    //eliminamos el usuario del session storage
    sessionStorage.removeItem("correoUsuario");
    window.location.replace("index.html","_self");
}
