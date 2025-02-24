const path = '../assets/img/uploadedDogs/'

async function prepararCarrito() {
    return new Promise((resolve, reject) => {
        console.log("en la función de preparar carrito");

        let listaIds = [];
        let correoUsuario = sessionStorage.getItem("correoUsuario");

        fetch('http://localhost:3000/users/' + correoUsuario)
            .then(response => response.json())
            .then(usuarioActual => {
                let listadelusuario = usuarioActual.perrosDadosEnAdopcion;

                listadelusuario.forEach(element => {
                    listaIds.push(element);
                });

                console.log("LISTA A PUSHEAR " + JSON.stringify(listaIds));
                sessionStorage.setItem("ListaImagenesPerros", JSON.stringify(listaIds));

                resolve();
            })
            .catch(error => {
                reject(new Error("Error en la solicitud: " + error.message));
            });

        console.log("Terminé oficialmente de preparar el session");
        console.log("Session preparado: ", sessionStorage);
    });
}

async function showUserDogs() {
    try {
        await prepararCarrito();
        console.log("Preparación de carrito terminada y oficialmente en la función");
        console.log("Carrito con el que trabajaré en la función:" + sessionStorage);

        let listaSession = JSON.parse(sessionStorage.getItem("ListaImagenesPerros"));
        let item = ''; // Variable para almacenar los elementos portfolio-item

        for (let i = 0; i < listaSession.length; i++) {
            try {
                let response = await fetch("http://localhost:3000/dogs/id/" + listaSession[i]);
                let info = await response.json();
                console.log(info);

                // Agregar el portfolio-item
                item += `<div class="col-lg-4 col-sm-6 mb-4">
                    <div id="dog-description" class="portfolio-item">
                        <a class="portfolio-link" href="/WebPage/views/dogDescription.html">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                            </div>
                            <img class="img-fluid" src="${path + info.imagen}" alt="..." />
                        </a>
                        <div class="portfolio-caption">
                            <div class="portfolio-caption-heading">${info.nombre}</div>
                            <div class="portfolio-caption-subheading text-muted">${info.raza}</div>
                            <div class="idChosenDog text-muted hidden">${info._id}</div>
                        </div>
                        <!-- Botón Eliminar perro -->
                        
                    </div>
                    <div style="display: flex; justify-content: center; align-items: center;">
                            <button class="button-eliminar" onclick="eliminarPerro('${info._id}')">Eliminar perro</button>
                        </div>
                </div>`;
            } catch (error) {
                console.error("Error en la solicitud del perro:", error);
            }
        }

        // Agregar los elementos al DOM
        item = `<div class="row">${item}</div>`;
        document.getElementById('UserDog').innerHTML = item;


        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(portfolioItem => {
            portfolioItem.addEventListener('click', function (event) {
                event.preventDefault();

                // Save the selected dog name to sessionStorage
                const idDog = portfolioItem.querySelector('.idChosenDog').textContent.trim();
                sessionStorage.setItem('selectedDogId', idDog);

                // Redirect to the other page
                window.location.href = '../views/dogDescription.html';
            });
        });

    } catch (error) {
        console.error("Error al preparar el carrito:", error);
    }
}


function eliminarPerro(idPerro) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('DELETE', 'http://localhost:3000/dogs/id/' + idPerro);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send();
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve();
                actualizarListaEliminacion(idPerro)
                window.location.href = '../views/userAdoptions.html'
            } else {
                reject();
            }
        };
        xhr.onerror = () => {
            reject();
        };
    });
}

async function actualizarListaEliminacion(idDog){
    return new Promise(()=>{
        //actualizamos la lista del usuario
        let lista = sessionStorage.getItem("ListaImagenesPerros");
        let correo = sessionStorage.getItem("correoUsuario");

        // Verifica si lista es null o no es una cadena JSON válida
        let parsedLista = [];
        if (lista) {
            try {
                parsedLista = JSON.parse(lista);
                parsedLista = parsedLista.filter(_id => _id !== idDog);
                
                // Actualiza el valor en sessionStorage después de modificar el array
                sessionStorage.setItem("ListaImagenesPerros", JSON.stringify(parsedLista));
            } catch (error) {
                console.error("Error al parsear lista como JSON: " + error);
            }
        }

        // Creamos el JSON que mandaremos
        let json = {
            perrosDadosEnAdopcion: parsedLista
        };


        let xhr = new XMLHttpRequest();
        xhr.open("PUT","http://localhost:3000/users/updateList/"+correo);
        xhr.setRequestHeader("Content-type","application/json;charset=UTF-8");
        xhr.send(JSON.stringify(json));
        xhr.onload=()=>{
            if(xhr.status != 404 || xhr.status != 500){
                alert("Perro eliminado correctamente");
                resolve();
            }else{
                alert("Error al eliminar perro");
                reject();
            }
        }
    })
}

showUserDogs();
