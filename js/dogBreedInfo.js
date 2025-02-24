const selectedValue = sessionStorage.getItem("selectedValue");

function showDogInfo(selectedValue){
    let xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:3000/infodogs/' + selectedValue);
    xhr.send();
    let item = '';
    let dogInfo = document.getElementById('dogInfo');
    console.log(dogInfo);
    xhr.onload = function(){
        let info = JSON.parse(xhr.response);
        console.log(info.personalidad);
        item += `<div class="text-center">
        <h2 class="section-heading text-uppercase">Información General</h2>
        <h3 class="section-subheading text-muted">Familiarízate con toda la información necesaria antes de decidir adoptar un ${info.raza}.</h3>
    </div>
    <ul class="timeline">
        <li>
            <div class="timeline-image"><img class="rounded-circle img-fluid" src=${info.imagen1} alt="..." /></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <h4 class="bold-text">Personalidad</h4>
                </div>
                <div class="normal-text"><p class="text-muted">${info.personalidad}

                </p></div>
            </div>
        </li>
        <li class="timeline-inverted">
            <div class="timeline-image"><img class="rounded-circle img-fluid" src="/WebPage/assets/img/about/health.jpg" alt="..." /></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <h4 class="bold-text">Salud</h4>
                </div>
                <div class="normal-text"><p class="text-muted">${info.salud}</p></div>
            </div>
        </li>
        <li>
            <div class="timeline-image"><img class="rounded-circle img-fluid" src=${info.imagen2} alt="..." /></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <h4 class="bold-text">Ejercicio</h4>
                </div>
                <div class="normal-text"><p class="text-muted">${info.ejercicio}</p></div>
            </div>
        </li>
        <li class="timeline-inverted">
            <div class="timeline-image"><img class="rounded-circle img-fluid" src="/WebPage/assets/img/about/food.png" alt="..." /></div>
            <div class="timeline-panel">
                <div class="timeline-heading">
                    <h4 class="bold-text">Nutrición</h4>
                </div>
                <div class="normal-text"><p class="text-muted">${info.nutricion}</p></div>
            </div>
        </li>
        <li class="timeline-inverted">
            <div class="timeline-image">
                <h4>
                    ¡Se Parte
                    <br />
                    De Su
                    <br />
                    Historia!
                </h4>
            </div>
        </li>
    </ul>`
    dogInfo.innerHTML = item;
    }
}

function showDogName(selectedValue){
    let xhr = new XMLHttpRequest();
    xhr.open('GET','http://localhost:3000/infodogs/' + selectedValue);
    xhr.send();
    let item = '';
    let dogInfoName = document.getElementById('dogInfoName');
    console.log(dogInfo);
    xhr.onload = function(){
        let info = JSON.parse(xhr.response);
        item += `<div class="masterhead-subheading" >Descubre el amor y los cuidados específicos que el ${info.raza} necesita para una vida feliz y saludable</div>`
        dogInfoName.innerHTML = item;
    }

}


showDogName(selectedValue)
showDogInfo(selectedValue);
