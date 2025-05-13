Feature: Filtrado de perros en adopción

  Scenario: El usuario filtra por raza "Husky" en la sección de perritos
    Given El usuario está en la página de perritos
    When El usuario selecciona "Husky" en el filtro de raza
    Then El filtro de raza muestra "Husky"


  

