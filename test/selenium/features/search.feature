Feature: Buscar información de una raza de perro

  Scenario: El usuario selecciona la raza "Chow Chow"
    Given El usuario abre la página de razas
    When Selecciona la raza "Chow Chow"
    Then Se muestra información relacionada con "Chow Chow"

