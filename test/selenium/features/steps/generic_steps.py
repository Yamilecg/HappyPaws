from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.service import Service as FirefoxService
from webdriver_manager.firefox import GeckoDriverManager

from time import sleep
url = "http://localhost:80"

@given("initialize set up and variables")
def set_up_environment(context):
    context.element = ''

@given("the user opens the browser and searches for {page}")
def open_browser(context, page):
    context.driver = webdriver.Firefox()
    available_pages = {'main page':'/', 'program':'/#program'}
    try:
        context.driver.get(url + available_pages[page])  
    except Exception as e:
        print("Ocurrió un error:", e)

@then("verify section with id {id} exist")
@then("verify {tag} containing {text} exist")
def verify_tag(context, tag='', text='', id=''):
    xpath = ''
    if 'h' in tag.lower() or 'a' in tag.lower():
        xpath = f'//{tag}[normalize-space()="{text}"]'
        print(xpath)
        try:
            element = context.driver.find_element(By.XPATH, xpath)
            assert element.text == text
            context.element = element
        except Exception as e:
            print("Ocurrió un error:", e)
    elif id != '':
        try:
            context.driver.find_element(By.ID, id)
        except Exception as e:
            print("Ocurrió un error:", e)

@then("click on last element")
def click_on_element(context):
    try:
        context.element.click()
    except Exception as e:
        print("Ocurrió un error:", e)

@then("wait until {wait_type}")
def wait_times(context, wait_type):
    waiters = {"page is open":2, "element is visible":3}
    sleep(waiters["page is open"])

    
@then("close all windows")
def after_scenario(context):
    context.driver.quit()