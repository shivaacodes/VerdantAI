# VerdantAI
### Intelligent Plant Diagnostics & Spectral Telemetry Suite

VerdantAI started as a simple color-mapping script called ChloroMap. I wanted to see if I could combine standard computer vision with multimodal AI to diagnose houseplants and generate tailored care advice. Over time, I modernized it into a full, decoupled Next.js 15 application with a dedicated backend API.

The project is built to show clean, modular code, efficient payload management (making heavy mobile uploads performant), and a polished user experience.

---

## Why I Built This

I have a few houseplants that occasionally look sad, and I wanted a tool that did more than just guess what was wrong. I designed this app to approach plant care from two angles:
1. **Objective Computer Vision**: Using OpenCV to isolate leaf pixels and measure their HSV (Hue, Saturation, Value) channels, giving a solid metric of chlorophyll density and hydration.
2. **Generative AI Analysis**: Passing these exact color metrics and a photo of the specimen to Google's Gemini 1.5 model, parameterized by the specific plant species (like Monstera or Tomato), to get a targeted treatment plan.

---

## The Engineering Details

### 1. Decoupled Next.js Router Structure
Instead of putting everything on a single, crowded page, I separated the app into two distinct routes:
* **The Landing Page (`/`)**: A clean homepage that explains the concept, lists the core features, and handles the landing CTAs.
* **The App Console (`/console`)**: A dedicated, distraction-free workspace for uploading leaves, reviewing HSV metrics, and completing treatment checklists.
* **Why it matters**: This keeps the primary homepage payload extremely light (154 kB First Load JS) while lazy-loading heavy analysis logic and PDF libraries only when the user enters the active console workspace.

### 2. High-Speed Foliar Segmentation (OpenCV)
Camera photos taken on modern smartphones are massive (often 5MB to 15MB), which stalls API gateways. I optimized this pipeline in the backend:
* **Dynamic Downscaling**: The Flask API automatically scales incoming images to a maximum of 1024px before sending them to the network, reducing data payloads by 95% and lowering pipeline latency to under 2.5 seconds.
* **Foliar Masking**: The CV processor converts images to the HSV color space and runs threshold segmentation. By isolating only the green and yellow leaf pixels, it calculates color averages strictly on the plant, completely ignoring desk or paper backgrounds.
* **Target Boundary Contours**: The backend traces an emerald target boundary around the leaf and outputs a watermarked processed image back to the client.

### 3. Responsive Workspace Stacking
On mobile viewports, side-by-side grids quickly break. I used Tailwind order classes to ensure the workspace stacks logically:
* **Mobile Layout**: The specimen capture interface displays first, followed by the circular metric gauges, while the historical scan registry is pushed to the bottom.

### 4. Local Caching & PDF Generation
* **Scan Registry**: Recent scans are saved directly to the browser's local cache (`localStorage`), allowing users to click through their past analyses instantly.
* **Botanical Certificate Exporter**: The app compiles HSV results, checklist status, and species metadata into a formatted PDF using jsPDF, completed with a vector validation seal.

---

## Technical Stack

* **Frontend**: Next.js 15 (App Router, React 19), Tailwind CSS, Framer Motion, jsPDF
* **Backend**: Python Flask, OpenCV (`opencv-python`), Google GenerativeAI API

---

## Quick Start

### 1. Backend Setup
Navigate to the backend directory, set up your environment, and run the server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# (Optional: Add a Gemini Key. If omitted, the app runs in local mock mode)
echo "GEMINI_API_KEY=your_key_here" > .env

python app.py
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
Navigate to the frontend directory, install dependencies, and run the dev server:
```bash
cd ../frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

To verify type configurations and build optimization:
```bash
npm run build
```

---

## Author
* **Shiva Sajay**
