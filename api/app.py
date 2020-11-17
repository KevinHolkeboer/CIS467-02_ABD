
from flask import Flask 
from flask import Blueprint, jsonify, request
import sys

app = Flask(__name__)

@app.route('/calculate', methods = ['POST'])
def calculate():
    values = request.get_json()
    print("hello")
    print(values, file=sys.stderr)
    return 'Done', 201