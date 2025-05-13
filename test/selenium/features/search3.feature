Feature: Historial de perros en adopción

  Scenario: El usuario hace clic en el botón Agregar para dar en adopción a un perro
    Given El usuario está en la página de historial de adopción
    When El usuario hace clic en el botón "Agregar"
    Then El navegador redirige a la página "uploadDog.html"

