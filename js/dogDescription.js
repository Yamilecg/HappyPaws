const selectedValue = sessionStorage.getItem("selectedDogId");

function star(rating){
    var ratingValue = rating;

    // Obtener la lista de estrellas
    var stars = document.getElementById('rating-energia').getElementsByClassName('star');

    // Colorear las primeras "ratingValue" estrellas
    for (var i = 0; i < ratingValue; i++) {
        stars[i].style.backgroundColor = '#ffd700';
    }
}

function showDogDescription(selectedValue) {
    console.log(selectedValue);
    const path = '../assets/img/uploadedDogs/';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "http://localhost:3000/dogs/id/" + selectedValue);
    xhr.send();
    let item = '';
    let dogDesc = document.getElementById('dogDesc');
    xhr.onload = function () {
        let info = JSON.parse(xhr.response);
        console.log(info)
        item += `<div class="row">
        <div class="col-lg-5 pb-4 pb-lg-0">
            <br>
            <img class="img-fluid" src=${path + info.imagen} style="width: 100%; max-height: 700px;" alt="">
            <br><br>
            <h5>Información de Contacto: </h5>
            <h6 class="d-inline bold-text"><i class="fa-solid fa-location-dot" style="color: #00000a;"></i> Dirección: </h6><p class="d-inline normal-text">${info.direccion}</p><br>
            <h6 class="d-inline bold-text" ><i class="fa-solid fa-phone" style="color: #00000a;"></i> Télefono: </h6><p class="d-inline normal-text" >${info.telefono}</p><br>
            <h6 class="d-inline bold-text" ><i class="fa-solid fa-envelope" style="color: #00000a;"></i> Correo: </h6><p class="d-inline normal-text" >${info.correo}</p><br>
        </div>
        <div class="col-lg-7">
            <br><br>
            <h3 class="text-primary text-uppercase bold-text" style ="text-align: center;">Hola soy ${info.nombre}</h3>
            <h6 class="mb-4 d-inline bold-text" >Edad: </h6><p class="d-inline normal-text" >${info.edad}</p><br>
            <h6 class="mb-4 d-inline bold-text" >Raza: </h6><p class="d-inline normal-text" >${info.raza}</p><br>
            <h6 class="mb-4 d-inline bold-text" >Color: </h6><p class="d-inline normal-text" >${info.color}</p><br><br>
            <h6 class = "bold-text">Nivel de energía:</h6>
            <ul id="rating-energia">
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
                <li class="star"></li>
            </ul>
            <h6 class = "bold-text">Historial médico: </h6>
            <p class = "normal-text">Vacunas Recientes: </p>
            <ul class = "normal-text">`

            for (vacuna of info.historialMedico){
                item += `<li><i class="fa-solid fa-bone" style="color: #00000f;"></i> ${vacuna}</li>`
            }
            item += `</ul>
            <h6 class = "bold-text">Problemas de Salud Anteriores: </h6>
            <ul class = "normal-text">`
            for (problemas of info.problemasSalud){
                item += `<li><i class="fa-solid fa-paw" style="color: #00000f;"></i> ${problemas}</li>`
            }
            item+= `</ul>
            <h6 class = "bold-text">Medicamentos Actuales: </h6>
            <ul class = "normal-text">
                <li>${info.medicamentos}</li>  
            </ul>
            <h6 class = "bold-text">Descirpción general: </h6>
            <p class = "normal-text">${info.descripcion}</p>
        </div>
    </div>`;

        dogDesc.innerHTML = item;
        star(info.energia);
    }
}

showDogDescription(selectedValue);
