import os
import pandas
from flask import Flask, flash, request, redirect, url_for, send_from_directory
import sys

basedir = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = basedir + '/ExcelFiles'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/upload', methods = ['POST'])
def upload():
    file = request.files['file']
    product_Data= pandas.read_excel(file, sheet_name='Product')
    Product_Data_Json = product_Data.to_json(orient='records')

    #file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
    return Product_Data_Json, 201


@app.route('/calculateNew', methods = ['GET'])
def calculateNew():
    ItemKey = request.get_json()
    print(ItemKey,  file=sys.stderr)
    return ItemKey, 200

@app.route('/calculateExisting', methods = ['GET'])
def calculateExisting():
    NewBev = request.get_json()
    print(NewBev,  file=sys.stderr)
    return NewBev, 200

@app.route('/login', methods = ['POST'])
def login():
    creds = request.get_json(force=True)
    if(creds['creds']['username'] == "sd" and creds['creds']['username']  == "sd"):
        return ('', 201)   
    else:
        return ('', 200)
    


