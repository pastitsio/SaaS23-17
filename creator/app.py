"""
All plots utilize the custom Plot class.
Distinction is done with cmd args.
"""
import argparse
import json

from auth import require_token_validation
from database_loader import db
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from Plot import *
from utils import check_file_exists, preflight_options, validate_user


# application factory function
def create_app(user, PLOT):
    app = Flask("create_app")
    # use CORS
    CORS(app)
    # [Token validation, OPTIONS handling, file existence] checks before each request
    app.before_request(preflight_options)
    app.before_request(lambda: require_token_validation(user))
    app.before_request(check_file_exists)

    @app.route("/create", methods=["POST", "OPTIONS"])
    def create():
        try:
            file = json.load(request.files["file"])
            plotObj = PLOT(file)
            plotObj.validate()

            # !TODO: kafkify changes
            mode = request.args.get('mode')
            if mode == 'preview':
                # always create previews in JPEG format
                image = plotObj.create_chart(img_format="jpeg")['jpeg']

                return Response(image, mimetype=f"image/jpeg"), 200
            
            elif mode == 'save':
                images = plotObj.create_chart(img_format="all")
                ids = db.save_images(images)

                return "Success", 200
            else: 
                raise ValueError("Mode should either be SAVE or PREVIEW")
            
        except Exception as e:
            return jsonify({"message": e}), 500

    return app


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-u", "--user", type=validate_user, help=f"Type of app.", required=True
    )
    parser.add_argument("-p", "--port", help=f"TCP port to run on.", required=True)

    # Parse the command-line arguments
    args = parser.parse_args()

    user = args.user.upper()  # which plot type, for runtime
    if user == "BAR_LABEL_PLOT":
        PLOT = BarLabelPlot
    if user == "SCATTER_PLOT":
        PLOT = ScatterPlot
    if user == "SIMPLE_PLOT":
        PLOT = SimplePlot

    app = create_app(user, PLOT)

    port = args.port
    app.run(debug=True, port=port)
