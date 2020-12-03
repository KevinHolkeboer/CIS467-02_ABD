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


@app.route('/calculateNew', methods = ['POST'])
def calculateNew():
    ItemKey = request.get_json(force=True)
    print(ItemKey,  file=sys.stderr)
    return ItemKey, 200

@app.route('/calculateExisting', methods = ['POST'])
def calculateExisting():
    NewBev = request.get_json(force=True)
    print(NewBev,  file=sys.stderr)
    return NewBev, 200

@app.route('/login', methods = ['POST'])
def login():
    creds = request.get_json(force=True)
    if(creds['creds']['username'] == "sd" and creds['creds']['username']  == "sd"):
        return ('', 201)   
    else:
        return ('', 200)
    


from rpy2.robjects import r

# Choosing a CRAN Mirror
import rpy2.robjects.packages as rpackages
utils = rpackages.importr('utils')
utils.chooseCRANmirror(ind=1)

from rpy2.robjects.vectors import StrVector
packages = ("tidyverse", "naivebayes", "fpc", "dbscan", "tidymodels", "devtools")
#Run this once to install the packages
utils.install_packages(StrVector(packages))

r('library(devtools)')
#These packages get installed when updated and on initial run
r('devtools::install_github("kassambara/factoextra")')
r('devtools::install_github("mhahsler/dbscan")')

#Load R libraries
r('library(factoextra)')
r('library(tidyverse, tidymodels)')
r('library(naivebayes, dbscan)')

#USE TO TEST BASIC R STUFF WORKS
r('print("Libraries installed and loaded")')
r('x <- rnorm(100)')
r('print(x)')
import rpy2
print(rpy2.__version__)
