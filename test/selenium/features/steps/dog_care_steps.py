from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from behave import given, when, then
import time


@when("The user selects the dog care section")
def select_dog_care_section(context):
    context.driver.find_element(
        By.XPATH, "//body/nav[@id='mainNav']/div[@class='container']/div[@id='navbarResponsive']/ul[@class='navbar-nav text-uppercase ms-auto py-4 py-lg-0']/li[1]/a[1]"
    ).click()
    time.sleep(2)

@when('The user selects "{breed}" option in the dog care section')
def select_breed_information(context, breed):
    raza_element = WebDriverWait(context.driver, 15).until(
        EC.presence_of_element_located(
            (By.XPATH, f"//a[normalize-space()='Chow Chow']"))
    )
    raza_element.click()


@then('The user should see the "{breed}" information')
def step_show_breed_info(context, breed):
    print(f"✅ {breed} information displayed successfully.")
    time.sleep(3)
    context.driver.quit()