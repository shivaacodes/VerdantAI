import os
import re
import logging
from PIL import Image
import google.generativeai as genai

logger = logging.getLogger("verdantai.gemini")

# Configure Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
        logger.info("Google Generative AI client initialized successfully")
    except Exception as e:
        logger.error(f"Failed to configure Google Generative AI client: {str(e)}")
else:
    logger.warning("GEMINI_API_KEY environment variable is not set. VerdantAI will run with simulated AI reports.")

def get_mock_summary(hsv_data, species="Generic Plant"):
    """Generates realistic plant insights locally customized for the selected species."""
    hue = hsv_data.get("hue", 60)
    saturation = hsv_data.get("saturation", 150)
    value = hsv_data.get("value", 120)
    
    logger.info(f"Generating realistic local diagnosis mock report for {species}...")
    
    # Custom species stress alerts
    stress_mapping = {
        "Tomato": "blossom-end rot or early foliar blight",
        "Monstera": "root saturation or chlorosis leaf spots",
        "Fiddle Leaf Fig": "vein edema or light deprivation rust",
        "Pothos": "nitrogen deficiency or root rot yellowing",
        "Rose": "powdery mildew or black spot infection",
        "Generic Plant": "nutrient stress or irregular hydration spots"
    }
    species_stress = stress_mapping.get(species, stress_mapping["Generic Plant"])

    if hue < 40:
        return [
            f"Alert: Folier chlorosis indicated by lower Hue index ({hue}/179) on this {species} leaf.",
            f"Foliage shows yellowing patterns typical of {species_stress}. Photosynthesis is diminished.",
            "Water levels appear slightly depleted. Check if soil is dry beyond top 2 inches.",
            f"Prescription: Apply nitrogen-rich fertilizer tailored for {species}, and establish consistent deep-watering intervals."
        ]
    elif hue > 75:
        return [
            f"Vibrant green leaf density detected (Hue: {hue}/179) on this {species}.",
            f"No visible symptoms of {species_stress} or nutrient deficiencies found.",
            "Excellent leaf turgidity and water retention indicated by deep color saturation.",
            f"Prescription: Keep the {species} at its current lighting position and maintain regular pruning."
        ]
    else:
        return [
            f"Normal, healthy chlorophyll absorption spectrum observed on this {species} (Hue: {hue}/179).",
            f"Moderate color saturation indicates stable nutrient assimilation with low risk of {species_stress}.",
            "Leaf surface displays healthy moisture balance without waterlogging.",
            f"Prescription: Ensure adequate light exposure suitable for {species} and verify soil moisture."
        ]

def get_plant_summary(hsv_data, image_path=None, species="Generic Plant"):
    """
    Analyzes plant health using multimodal Gemini Vision.
    Combines quantitative OpenCV HSV color metrics with qualitative visual details of the specific species leaf.
    """
    if not api_key:
        return get_mock_summary(hsv_data, species)

    try:
        model = genai.GenerativeModel("gemini-2.0-flash-exp")
        
        prompt = (
            "You are VerdantAI, an expert botanist and leaf-health diagnostician.\n"
            f"Analyze this {species} leaf. You are provided with two streams of data:\n"
            f"1. Quantitative average color metrics from OpenCV:\n"
            f"   - Average Hue: {hsv_data['hue']}/179 (OpenCV green is typically 35-85)\n"
            f"   - Average Saturation: {hsv_data['saturation']}/255\n"
            f"   - Average Value (Brightness): {hsv_data['value']}/255\n\n"
            f"2. Visual leaf image of a {species}.\n\n"
            f"Diagnose potential deficiencies, water-stress, leaf spots, or fungal lesions SPECIFIC to {species}.\n"
            "Provide precisely 3 to 4 concise, expert-grade, actionable bullet points.\n"
            "Do NOT use any markdown formatting, asterisks, or bold tags in your insights.\n"
            "Output only the list, with each point numbered cleanly (e.g. '1. Insight', '2. Insight')."
        )
        
        payload = [prompt]
        if image_path and os.path.exists(image_path):
            try:
                pil_image = Image.open(image_path)
                payload.append(pil_image)
                logger.info(f"Loaded image {image_path} for multimodal Gemini diagnostics on {species}")
            except Exception as e:
                logger.warning(f"Could not load visual image, diagnosing {species} with HSV averages only: {str(e)}")

        response = model.generate_content(payload)
        summary_text = response.text.strip()
        
        # Parse numbered list items
        summary_points = re.split(r"\n\d+\.\s+", summary_text)
        
        # If split is empty or returns a single element without split
        if len(summary_points) <= 1:
            summary_points = [p.strip() for p in summary_text.split('\n') if p.strip()]
            summary_points = [re.sub(r'^\s*[-*#\d\.\s]+', '', p).strip() for p in summary_points]
        else:
            # Clean first item since it might contain leading '1. '
            if summary_points[0].startswith("1. "):
                summary_points[0] = summary_points[0][3:]
            elif re.match(r'^\d+\.\s+', summary_points[0]):
                summary_points[0] = re.sub(r'^\d+\.\s+', '', summary_points[0])
            summary_points = [point.strip() for point in summary_points if point.strip()]

        # Filter out empty entries and ensure no bold markers
        summary_points = [p.replace("**", "").replace("*", "").strip() for p in summary_points if p.strip()]
        logger.info(f"Generated {len(summary_points)} plant insights for {species}")
        
        return summary_points if summary_points else get_mock_summary(hsv_data, species)
        
    except Exception as e:
        logger.error(f"Gemini API processing failed for {species}: {str(e)}. Falling back to simulated model.")
        return get_mock_summary(hsv_data, species)


