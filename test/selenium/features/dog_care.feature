Feature: Information about dog care

  Scenario: The user selects chow chow in the dog care section
    Given I open the login page
    When I click the "Iniciar Sesión" button on the home page
    And I enter the registered email "amando@gmail.com"
    And I enter the registered password "123"
    And I click the "Iniciar sesión" button on the login form
    And The user selects the dog care section
    And The user selects "chow chow" option in the dog care section
    Then The user should see the "chow chow" information