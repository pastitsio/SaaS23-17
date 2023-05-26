import json
from auth import invalidate_token
from config import config

from charts import validate_json_input
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Run the token validation before each request
@app.before_request
def before_request():
    # OPTIONS method is preflight, meaning it is sent by the browser
    # to check CORS functionality. Interceptor cannot interfere with it.
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers['Access-Control-Allow-Origin'] = config['FRONTEND']['SERVER_URL']
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    
        return response
    
    token = request.headers.get('Authorization')
    token = token.split()[1] # remove 'Bearer' word

    if not invalidate_token(token):
        return 'Invalid Token', 401


@app.route('/validate/', methods=['POST', 'OPTIONS'])
def validate():

    if 'file' not in request.files:
        return 'No file provided', 400

    file = request.files['file']
    if file.content_type != 'application/json':
        return 'Unsupported file format. Expected JSON', 415
    
    try:
        file = json.load(file)
        
        validate_json_input(file)
    
        return 'Success', 200
    
    except Exception as e:
        return str(e), 415

if __name__ == '__main__':
    app.run(debug=True, port=config['SERVER']['PORT'])
