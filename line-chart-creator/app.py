from flask import Flask, request, jsonify
from charts import create_chart, validate_input

app = Flask(__name__)

@app.route('/validate', methods=['POST'])
def validate_endpoint():
    try:
        json_data = request.get_json()  # Read JSON data from the request body
        if json_data:
            if validate_input(json_data):
                image = create_chart(json_data)
                # produce changes to kafka 
                'image/png'
            return jsonify({'valid': validation_result})
        else:
            return jsonify({'error': 'Invalid JSON data provided'})
    except Exception as e:
        return jsonify({'error': str(e)})
    

@app.route('/create', methods=['POST'])
def create_endpoint():


if __name__ == '__main__':
    app.run(debug=True)
