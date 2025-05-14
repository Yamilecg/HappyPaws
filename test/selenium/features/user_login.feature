Feature: User Login

  Scenario: Successful login with registered credentials
    Given I open the login page
    When I click the "Iniciar Sesión" button on the home page
    And I enter the registered email "amando@gmail.com"
    And I enter the registered password "123"
    And I click the "Iniciar sesión" button on the login form
    Then I should be logged in successfully