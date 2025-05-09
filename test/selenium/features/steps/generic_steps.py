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

url = "https://www.google.com.mx/"
service = FirefoxService(GeckoDriverManager().install())

@given("the user opens {page}")
def open_browser(context, page):
    context.driver = webdriver.Firefox(service=service)
    available_pages = {'main page':'/'}
    try:
        context.driver.get(url + available_pages[page])  
        sleep(5)
    except Exception as e:
        print("Ocurrió un error:", e)

@then("wait until {wait_type}")
def wait_times(context, wait_type):
    waiters = {"page is open":5}
    if wait_type == "page is open":
        context.wait.until(EC.presence_of_element_located((By.NAME, "q")))

    
@then("close all windows")
def after_scenario(context):
    context.driver.quit()