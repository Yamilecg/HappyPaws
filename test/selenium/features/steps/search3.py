from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
import time

@given('El usuario está en la página de historial de adopción')
def step_impl(context):
    context.driver = webdriver.Chrome()
    context.driver.get('http://127.0.0.1:5500/views/userAdoptions.html')
    context.driver.maximize_window()
    time.sleep(1)

@when('El usuario hace clic en el botón "Agregar"')
def step_impl(context):
    agregar_button = context.driver.find_element(By.XPATH, "//button[contains(text(),'Agregar')]")
    agregar_button.click()
    time.sleep(1)

@then('El navegador redirige a la página "uploadDog.html"')
def step_impl(context):
    assert "uploadDog.html" in context.driver.current_url
    context.driver.quit()
