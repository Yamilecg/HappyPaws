const dropdownItems = document.querySelectorAll('.perros');

dropdownItems.forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
                
        // Obtiene el valor seleccionado
        const selectedValue = item.getAttribute('data-value');

        // Guarda el valor seleccionado en el almacenamiento local
        sessionStorage.setItem('selectedValue', selectedValue);

                // Redirige a la otra página
        window.location.href = '../views/dogBreedInfo.html';
    });
});


const portfolioItem = document.getElementById('dog-description');

if (portfolioItem) {
    const link = portfolioItem.querySelector('.portfolio-link');
    const dogName = portfolioItem.querySelector('.portfolio-caption-heading').textContent.trim();
    
    link.addEventListener('click', function(event) {
        event.preventDefault();

        // Save the selected dog name to sessionStorage
        sessionStorage.setItem('selectedDogName', dogName);

        // Redirect to the other page
        window.location.href = 'dogDescription.html';
    });
}
