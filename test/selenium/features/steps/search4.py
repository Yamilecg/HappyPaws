from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from behave import given, when, then

@given('el usuario está en la página de verificación')
def step_impl(context):
    context.driver = webdriver.Chrome()
    context.driver.get('http://127.0.0.1:5500/views/certifiedUser.html')

@when('el usuario llena todos los campos requeridos')
def step_impl(context):
    context.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Ingresa tu nombre/s"]').send_keys('Juan')
    context.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Ingresa tu ocupación"]').send_keys('Ingeniero')
    context.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Ingresa tu domicilio"]').send_keys('Calle 123')
    context.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Ingresa tu telefono"]').send_keys('5551234567')
    context.driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Ingresa tu edad"]').send_keys('30')
    context.driver.find_element(By.CSS_SELECTOR, 'input[type="date"]').send_keys('1994-01-01')
    context.driver.find_element(By.ID, 'file-fotografia').send_keys('/path/to/fotografia.jpg')
    context.driver.find_element(By.ID, 'file-identificacion').send_keys('/path/to/identificacion.jpg')

@when('el usuario hace clic en el botón Enviar')
def step_impl(context):
    context.driver.find_element(By.XPATH, "//button[text()='Enviar']").click()

@then('el sistema debería aceptar los datos del usuario')
def step_impl(context):
    assert "certificado" in context.driver.page_source
    context.driver.quit()
