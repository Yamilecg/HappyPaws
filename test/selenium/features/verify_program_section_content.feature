#This feature test section "programa" display the correct data to the user
Feature: verify_program_section_content

Background: Prepare internal variables to avoid conflicts
    Given initialize set up and variables

Scenario: button_programa_works_propperly
#This scenario uses navbar button to reach the section programa
    Given the user opens the browser and searches for main page
    Then wait until page is open
    Then verify a containing Programa exist
    Then click on last element
    Then wait until element is visible
    Then verify section with id program exist
    Then close all windows

Scenario: Verify_container_and_h_tags
# This scenario verifies section htlm tag and titles appears correctly

    Given the user opens the browser and searches for program
    Then wait until page is open
    Then verify section with id program exist
    Then verify h2 containing Programa exist
    Then verify h3 containing Bienvenido a Happy Paws exist
    Then verify h4 containing Adopta exist
    Then verify h4 containing Da en adopción exist
    Then verify h4 containing Apoya la causa exist
    Then close all windows

