from fastai.vision.all import *
from fastai.vision.widgets import *
from flask import Blueprint

main = Blueprint("main", __name__)

@main.route("/predict")
def predict():
    path = Path()
    model = load_learner(path/'export.pkl')
    return model.predict("./testimage.png")[0]
    