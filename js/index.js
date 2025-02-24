
function showDogInfoIndex(pageNumber) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/dogs');
    xhr.send();
    
    const dogsPerPage = 6; 
    let items = '';
    let dogInfoIndex = document.getElementById('dogInfoIndex');
    const path = '../assets/img/uploadedDogs/';
    let filtroRaza = document.getElementById('filtro');
    pageNumber = pageNumber || 1;

    xhr.onload = function () {
        let dogs = JSON.parse(xhr.response);

        const startIndex = (pageNumber - 1) * dogsPerPage;
        const endIndex = startIndex + dogsPerPage;

        if (filtroRaza.value === "Ninguno") {
            for (let i = startIndex; i < endIndex && i < dogs.length; i++) {
                const dog = dogs[i];
                items += `<div class="col-lg-4 col-sm-6 mb-4">
                    <div id="dog-description" class="portfolio-item">
                        <a class="portfolio-link" href="/WebPage/views/dogDescription.html">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                            </div>
                            <img class="img-fluid" src="${path + dog.imagen}" alt="..." />
                        </a>
                        <div class="portfolio-caption">
                            <div class="portfolio-caption-heading">${dog.nombre}</div>
                            <div class="portfolio-caption-subheading text-muted">${dog.raza}</div>
                            <div class="idChosenDog text-muted hidden">${dog._id}</div>
                        </div>
                    </div>
                </div>`;
            }
        } else {
            for (let i = startIndex; i < endIndex && i < dogs.length; i++) {
                const dog = dogs[i];
                if (dog.raza == filtroRaza.value) {
                    items += `<div class="col-lg-4 col-sm-6 mb-4">
                    <div id="dog-description" class="portfolio-item">
                        <a class="portfolio-link" href="/WebPage/views/dogDescription.html">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                            </div>
                            <img class="img-fluid" src="${path + dog.imagen}" alt="..." />
                        </a>
                        <div class="portfolio-caption">
                            <div class="portfolio-caption-heading">${dog.nombre}</div>
                            <div class="portfolio-caption-subheading text-muted">${dog.raza}</div>
                            <div class="idChosenDog text-muted hidden">${dog._id}</div>
                        </div>
                    </div>
                </div>`;
                }
            }
        }
        items = `<div class="row">${items}</div>`;
        dogInfoIndex.innerHTML = items;

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

        const totalPages = Math.ceil(dogs.length / dogsPerPage);
        generatePaginationLinks(totalPages, pageNumber);
    }
}

function generatePaginationLinks(totalPages, currentPage) {
    let pagination = document.getElementById('pagination');
    let paginationHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<li class="active">${i}</li>`;
        } else {
            paginationHTML += `<li><a href="#portfolio" data-page="${i}" onclick="handlePaginationClick(${i})">${i}</a></li>`;
        }
    }
    pagination.innerHTML = `<ul>${paginationHTML}</ul>`;
}

function handlePaginationClick(pageNumber) {
    showDogInfoIndex(pageNumber);
}

var filtro = document.getElementById('filtro');
if (filtro) {
    filtro.addEventListener('change', function (event) {
        showDogInfoIndex();
    });
}

showDogInfoIndex();