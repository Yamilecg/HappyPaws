Feature: Filter adopted dogs by breed

  Scenario: The user selects breed in the breed filter
    Given The user is on dogs page
    When The user selects "Husky" in the breed filter
    Then The filter shows "Husky" in the breed filter