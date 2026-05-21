import os
import logging
from flask import Flask
from flask_cors import CORS

# Configure standard logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s'
)
logger = logging.getLogger("verdantai")

app = Flask(__name__)
CORS(app)

# Setup directories dynamically
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploads')
app.config['PROCESSED_FOLDER'] = os.path.join(BASE_DIR, 'processed')

# Ensure upload/processed folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)

logger.info(f"Uploads configured in: {app.config['UPLOAD_FOLDER']}")
logger.info(f"Processed outputs configured in: {app.config['PROCESSED_FOLDER']}")

# Import routes and register
from routes import init_routes
init_routes(app)

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    logger.info(f"Starting VerdantAI backend on port {port}...")
    app.run(debug=True, port=port)

