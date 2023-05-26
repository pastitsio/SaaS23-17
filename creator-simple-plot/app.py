import json

from auth import invalidate_token
from charts import create_chart
from config import config
from flask import Flask, Response, jsonify, request
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
        return jsonify({'message': 'Invalid Token'}), 401


@app.route('/create/', methods=['POST'])
def create():   
    
    # check available formats
    format = request.args.get('format', default='jpeg')
    if format not in config['PLOT']['FORMATS']:
        return jsonify({'message': f'Unsupported output format {format}.'}), 415

    # check file is in request
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400

    # check file is json
    file = request.files['file']
    if file.content_type != 'application/json':
        return jsonify({'message': 'Unsupported file format. Expected JSON.'}), 415

    try:
        file = json.load(file)
        img_stream = create_chart(file, format)
        # !TODO: store to database and kafkify
        return Response(img_stream, mimetype=f'image/{format}'), 200
    except:
        return jsonify({'message': 'Cannot create image.'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=config['SERVER']['PORT'])
