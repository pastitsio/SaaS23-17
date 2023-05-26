import json
from auth import invalidate_token
from config import config

from charts import create_chart, validate_json_input
from flask import Flask, Response, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# Run the token validation before each request
@app.before_request
def before_request():
    # OPTIONS method is preflight, meaning it is sent by the browser
    # to check CORS functionality. Interceptor cannot interfere with it.
    if (request.method == 'OPTIONS'):        
        return
    
    token = request.headers.get('Authorization')
    token = token.split()[1] # remove 'Bearer' word

    if not invalidate_token(token):
        return jsonify({'error': 'Invalid Token'}), 400


@app.route('/validate/', methods=['POST', 'OPTIONS'])
def validate():
    # Handle preflight OPTIONS request

    response = jsonify()
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Origin'] = config['FrontEnd']['SERVER_URL']
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.content_type != 'application/json':
        return 'Invalid file format. Expected JSON.', 400

    try:
        file = json.load(file)
        # Process the uploaded file here
        # !TODO: validate input
        result = validate_json_input(file)
        response = jsonify({'success': result})
        return response
    except Exception as e:
        return jsonify({'Error': str(e)})


@app.route('/create', methods=['POST', 'OPTIONS'])
def create_endpoint():
    
    response = jsonify()
    if request.method == 'OPTIONS':
        response.headers['Access-Control-Allow-Origin'] = config['FrontEnd']['SERVER_URL']
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response
    

    format = request.args.get('format', default='jpeg')

    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.content_type != 'application/json':
        return 'Invalid file format. Expected JSON.', 400
    
    try:
        file = json.load(file)
        img_stream = create_chart(file, format)
        return Response(img_stream, mimetype=f'image/{format}'), 200
    except:
        return 'Error creating image.', 400
    
if __name__ == '__main__':
    app.run(debug=True)
