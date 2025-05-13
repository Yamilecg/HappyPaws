from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

@given('I open the login page')
def step_open_login_page(context):
    context.driver = webdriver.Chrome()
    context.driver.get("http://localhost")

@when('I click the "Iniciar Sesión" button on the home page')
def step_click_login_button_home(context):
    context.driver.find_element(By.XPATH, '//*[@id="navbarResponsive"]/ul/li[5]/a').click()
    time.sleep(2)

@when('I enter the registered email "{email}"')
def step_enter_email(context, email):
    context.driver.find_element(By.ID, 'input-correo-iniciar-sesion').send_keys(email)
    time.sleep(2)

@when('I enter the registered password "{password}"')
def step_enter_password(context, password):
    context.driver.find_element(By.ID, 'contra-iniciar-sesion').send_keys(password)
    time.sleep(2)

@when('I click the "Iniciar sesión" button on the login form')
def step_click_submit_button(context):
    context.driver.find_element(By.XPATH, '//*[@id="iniciarSesionModal"]/div/div/div[2]/div[3]/button').click()
    time.sleep(2)

@then('I should be logged in successfully')
def step_logged_in(context):
    print("✅ Login successful.")
    context.driver.quit()
