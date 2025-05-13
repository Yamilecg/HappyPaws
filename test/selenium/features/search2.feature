Feature: Buscar información de una raza de perro

  Scenario: El usuario selecciona la raza "Husky"
    Given El usuario abre la página de descripción del perro
    When Selecciona la raza "Husky"
    Then Se muestra información relacionada con "Husky"
