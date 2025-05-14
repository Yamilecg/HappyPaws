from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time


@given("The user is on dogs page")
def step_open_dog_page(context):
    context.driver = webdriver.Chrome()
    context.driver.get("http://localhost/index.html#portfolio")

    WebDriverWait(context.driver, 10).until(
        EC.presence_of_element_located((By.ID, "portfolio"))
    )


@when('The user selects "Husky" in the breed filter')
def step_select_husky_breed(context):
    breed_dropdown = WebDriverWait(context.driver, 10).until(
        EC.visibility_of_element_located((By.ID, "filtro"))
    )
    select = Select(breed_dropdown)
    select.select_by_visible_text("Husky")

    time.sleep(5)


@then('The filter shows "Husky" in the breed filter')
def step_verify_husky_displayed(context):
    selected_breed = context.driver.find_element(By.ID, "filtro")
    selected_breed_value = selected_breed.get_attribute("value")

    assert selected_breed_value == "Husky"
    context.driver.quit()
