Feature: Certificación de usuario

  Scenario: Usuario llena el formulario de verificación y lo envía
    Given el usuario está en la página de verificación
    When el usuario llena todos los campos requeridos
    And el usuario hace clic en el botón Enviar
    Then el sistema debería aceptar los datos del usuario
