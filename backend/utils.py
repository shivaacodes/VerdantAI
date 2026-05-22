import cv2
import os
import numpy as np
import logging
from gemini import get_plant_summary

logger = logging.getLogger("verdantai.utils")

# Fetch credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Supabase client: {str(e)}")
        logger.warning("Supabase integration disabled. Falling back to local storage serving.")
else:
    logger.warning("Supabase credentials not found. Running in local-only fallback mode.")

def process_image(filepath, species="Generic Plant"):
    logger.info(f"Starting analysis for image: {filepath} ({species})")
    try:
        # Load the uploaded leaf image
        img = cv2.imread(filepath)
        if img is None:
            logger.error(f"Failed to load image via OpenCV from: {filepath}")
            # Try loading via PIL as defensive fallback
            try:
                from PIL import Image as PILImage
                pil_img = PILImage.open(filepath).convert("RGB")
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
                logger.info("Successfully loaded image using PIL fallback")
            except Exception as pil_err:
                logger.error(f"PIL fallback also failed: {str(pil_err)}")
                return {"error": "Failed to load uploaded image. Ensure it is a valid JPG/PNG/JPEG."}

        # Downscale large images to max 1024px to reduce Gemini payload size
        h_orig, w_orig = img.shape[:2]
        max_dim = 1024
        if h_orig > max_dim or w_orig > max_dim:
            if h_orig > w_orig:
                scale = max_dim / h_orig
            else:
                scale = max_dim / w_orig
            new_w = int(w_orig * scale)
            new_h = int(h_orig * scale)
            img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
            logger.info(f"Resized image from {w_orig}x{h_orig} to {new_w}x{new_h}")

        # Convert to HSV color space using OpenCV
        hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

        # Segment green/yellow leaf pixels from background
        lower_green = np.array([25, 30, 30])
        upper_green = np.array([95, 255, 255])
        green_mask = cv2.inRange(hsv_img, lower_green, upper_green)
        
        # Find contours of the leaf
        contours, _ = cv2.findContours(green_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        # Create an annotated diagnostic output image based on the original BGR leaf
        annotated_img = img.copy()
        
        # Draw the target acquisition boundary outline (Glowing Emerald Green)
        if contours:
            cv2.drawContours(annotated_img, contours, -1, (16, 185, 129), 2)
            
        # Add high-tech digital HUD metadata watermarks on the processed leaf
        font = cv2.FONT_HERSHEY_SIMPLEX
        font_scale = 0.45
        color = (16, 185, 129)  # Emerald green
        thickness = 1
        
        # Draw target details
        cv2.putText(annotated_img, f"SPECIMEN: {species.upper()}", (15, 25), font, font_scale, color, thickness, cv2.LINE_AA)
        cv2.putText(annotated_img, "SYSTEM: VERDANTAI CORE SEGMENTER v1.2", (15, 45), font, font_scale, color, thickness, cv2.LINE_AA)
        
        # Calculate HSV average metrics
        height, width, _ = hsv_img.shape
        h, s, v = cv2.split(hsv_img)
        
        # Calculate HSV averages inside the leaf mask only; fall back to full image if no green detected
        if cv2.countNonZero(green_mask) > 0:
            avg_hue = int(cv2.mean(h, mask=green_mask)[0])
            avg_sat = int(cv2.mean(s, mask=green_mask)[0])
            avg_val = int(cv2.mean(v, mask=green_mask)[0])
            logger.info("HSV averages calculated strictly within segmented foliar mask pixels")
        else:
            avg_hue = int(np.mean(h))
            avg_sat = int(np.mean(s))
            avg_val = int(np.mean(v))
            logger.info("No foliar green pixels isolated. Calculating averages across full canvas.")
            
        hsv_data = {"hue": avg_hue, "saturation": avg_sat, "value": avg_val}
        logger.info(f"Calculated HSV color averages: {hsv_data}")

        cv2.putText(annotated_img, f"INDEX - HUE: {avg_hue} SAT: {avg_sat} VAL: {avg_val}", (15, height - 15), font, font_scale, color, thickness, cv2.LINE_AA)

        # Establish pathing for local processed file
        base_name = os.path.basename(filepath)
        root, ext = os.path.splitext(base_name)
        processed_filename = f"{root}_processed{ext}"
        
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        processed_dir = os.path.join(BASE_DIR, 'processed')
        os.makedirs(processed_dir, exist_ok=True)
        processed_path = os.path.join(processed_dir, processed_filename)

        logger.info(f"Saving annotated diagnostic output image to: {processed_path}")
        cv2.imwrite(processed_path, annotated_img)

        # Get high-fidelity diagnosis using Gemini Vision (prior to cleaning up files)
        # We pass the original upload filepath for visual detail analysis
        summary = get_plant_summary(hsv_data, filepath, species)

        processed_file_result = processed_filename

        # Perform cloud upload if Supabase is active
        if supabase is not None:
            try:
                # Upload original leaf
                logger.info(f"Uploading original leaf file {base_name} to Supabase bucket 'uploads'")
                with open(filepath, 'rb') as f:
                    supabase.storage.from_("uploads").upload(base_name, f)
                
                # Upload processed annotated leaf
                logger.info(f"Uploading processed file {processed_filename} to Supabase bucket 'processed'")
                with open(processed_path, 'rb') as f:
                    supabase.storage.from_("processed").upload(processed_filename, f)

                # Get cloud public URL
                processed_file_result = supabase.storage.from_("processed").get_public_url(processed_filename)
                logger.info(f"Supabase upload successful. Cloud serving URL: {processed_file_result}")

                # Clean up local copies when serving from cloud
                try:
                    os.remove(filepath)
                    os.remove(processed_path)
                    logger.info("Temporary local files cleaned up successfully after cloud upload")
                except Exception as clean_err:
                    logger.warning(f"Error during local file cleanup: {str(clean_err)}")

            except Exception as e:
                logger.error(f"Supabase storage upload failed: {str(e)}. Falling back to local serving.")
                # Leave local files intact for local routes serving
        else:
            # Local fallback cleanup: delete the original uploads file to save disk space
            # but keep the processed annotated file so the local GET route can serve it!
            try:
                os.remove(filepath)
                logger.info("Uploaded raw file removed. Keeping local processed annotated map for local serving.")
            except Exception as clean_err:
                logger.warning(f"Error deleting original upload file locally: {str(clean_err)}")

        result = {
            "width": width,
            "height": height,
            "processed_file": processed_file_result,
            "hue": avg_hue,
            "saturation": avg_sat,
            "value": avg_val,
            "summary": summary
        }
        return result

    except Exception as e:
        logger.error(f"Critical error during image processing execution: {str(e)}")
        return {"error": f"Image processing failed: {str(e)}"}
