import os
import logging
from flask import request, jsonify, send_from_directory
from utils import process_image

logger = logging.getLogger("verdantai.routes")

def init_routes(app):
    # Endpoint to upload and process an image
    @app.route('/api/process-image', methods=['POST'])
    def process_image_route():
        if 'file' not in request.files:
            logger.warning("Upload attempt failed: No file in request")
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            logger.warning("Upload attempt failed: Empty filename")
            return jsonify({"error": "No file selected"}), 400

        # Save the uploaded file locally inside configured UPLOAD_FOLDER
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        logger.info(f"Saving uploaded file to: {upload_path}")
        try:
            file.save(upload_path)
        except Exception as e:
            logger.error(f"Failed to save file: {str(e)}")
            return jsonify({"error": f"Failed to save uploaded file: {str(e)}"}), 500

        # Read optional plant species selector from form data
        species = request.form.get("species", "Generic Plant")
        logger.info(f"Species designated for analysis: {species}")

        # Process the image with OpenCV and species context (from utils.py)
        result = process_image(upload_path, species)
        
        if "error" in result:
            logger.error(f"Image processing error: {result['error']}")
            return jsonify({"error": result["error"]}), 500

        # Return success response
        response = {"message": "Image processed successfully", "result": result}
        logger.info("Image processing request succeeded")
        return jsonify(response)

    # Serve processed images locally
    @app.route('/api/processed/<filename>', methods=['GET'])
    def get_processed(filename):
        logger.info(f"Serving processed file request: {filename}")
        return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

