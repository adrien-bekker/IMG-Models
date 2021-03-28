from fastai.vision.all import *
from fastai.vision.widgets import *
import pyrebase
import os
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import urllib.request
import shutil
from flask import Blueprint, jsonify
from zipfile import ZipFile

# Runs a headless version of Chrome
option = webdriver.ChromeOptions()
option.add_argument("headless")

# Accesses chromedriver
PATH = "D:\chromedriver_win32\chromedriver.exe"
driver = webdriver.Chrome(PATH, options=option)


config = {
    "apiKey": "AIzaSyDbEnhgLOOOUlnC32fUNpPBICs7wkndO3k",
    "authDomain": "imagemodelsai.firebaseapp.com",
    "databaseURL": "https://imagemodelsai-default-rtdb.firebaseio.com",
    "projectId": "imagemodelsai",
    "storageBucket": "imagemodelsai.appspot.com",
    "messagingSenderId": "735222779032",
    "appId": "1:735222779032:web:89067b160b0f3efe6d94ed",
    "measurementId": "G-M0TEM10TWM"
}

firebase = pyrebase.initialize_app(config)
storage = firebase.storage()

main = Blueprint("main", __name__)

@main.route("/train_model")
def train():
    driver.quit()
    # Puts images in a datablock
    images = DataBlock(
        blocks=(ImageBlock, CategoryBlock),
        get_items=get_image_files,
        splitter=RandomSplitter(valid_pct=0.1),
        get_y=parent_label,
        item_tfms=Resize(256, ResizeMethod.Squish)
    )

    dataset = images.dataloaders(Path("./flask_server/img"), num_workers=0)

    model = cnn_learner(dataset, resnet18, metrics=error_rate)
    model.fine_tune(5)

    model.export()

    return "Done"

@main.route("/download_images/<keyword>/<int:num>")
def download_images(keyword, num):
    try:
        # Launches google with the given search address
        driver.get("https://google.com/search?q=" + keyword)

        # Goes to images for the search result
        link = driver.find_element_by_link_text("Images")
        link.click()

        # Finds and saves images
        main = driver.find_element_by_class_name("mJxzWe")
        img_link = main.find_elements_by_tag_name("img")
        
        os.mkdir(f"./flask_server/img/{keyword}")

        for i in range(num):
            img = img_link[i].get_attribute("src")
            urllib.request.urlretrieve(
                img, f"./flask_server/img/{keyword}/picture{i+1}.png")
        upload_images()
    finally:
        print("Done")
    
    return "Done"

def upload_images():
    for folder in os.listdir("./flask_server/img"):
        for img in os.listdir(f"./flask_server/img/{folder}"):
            storage.child(f"images/{folder}/{img}").put(f"./flask_server/img/{folder}/{img}")
    """ storage.child("py.py").put("./flask_server/server.py") """

@main.route("/download")
def download():
    file_paths = ["./flask_server/download/__init__.py", "./export.pkl", "./flask_server/download/server.py"]
    for file in file_paths:
        with ZipFile("./src/download.zip", "w") as zip:
            for file in file_paths:
                zip.write(file)
    return "Done"


    
