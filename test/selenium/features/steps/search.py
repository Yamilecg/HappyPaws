from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from behave import given, when, then

@given('El usuario abre la página de razas')
def step_open_page(context):
    context.driver = webdriver.Chrome()
    context.driver.get('http://127.0.0.1:5500/views/dogBreedInfo.html')
    context.driver.maximize_window()

@when('Selecciona la raza "{breed}"')
def step_select_breed(context, breed):
    WebDriverWait(context.driver, 15).until(
        EC.presence_of_element_located((By.LINK_TEXT, "Cuidados"))
    ).click()

    raza_element = WebDriverWait(context.driver, 15).until(
        EC.presence_of_element_located((By.XPATH, f"//a[@data-value='{breed}']"))
    )
    raza_element.click()

@then('Se muestra información relacionada con "{breed}"')
def step_show_breed_info(context, breed):
    WebDriverWait(context.driver, 15).until(
        EC.text_to_be_present_in_element((By.ID, 'dogInfoName'), breed)
    )
    assert breed in context.driver.page_source
    context.driver.quit()
