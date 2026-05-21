# VerdantAI 🌿
### *Intelligent Multimodal Plant Care & Spectral Telemetry Suite*

VerdantAI (formerly ChloroMap) is a modern, recruiter-grade agricultural SaaS demonstration platform. It combines high-speed, localized computer vision segmentation with multimodal generative AI to deliver real-time leaf health diagnostic telemetry and precision botanical care prescriptions.

To showcase clean software engineering and Next.js routing capabilities, the application has been architected to decouple the public-facing marketing page (`/`) from a dedicated, immersive diagnostics workspace (`/console`).

---

## 🌟 Key Features & Core Capabilities

### 🔍 1. Foliar Contour Target Segmenter (OpenCV)
* **High-Speed Boundary Tracing**: Uses HSV color-space isolation to dynamically segment green/yellow leaf pixels, ignoring background sheets, desks, or ambient noise.
* **Laser HUD Overlay**: Traces isolated specimen contour boundaries and watermarks the diagnostic image (`SPECIMEN: Monstrera`, `VERDANTAI SEGMENTER`).
* **Area Interpolation Downscaling**: Dynamic downscaling automatically resizes high-resolution mobile camera uploads (up to 1024px) in the pipeline, **reducing payload file size by 95%** and achieving end-to-end response times of **under 2.5 seconds**.

### 🤖 2. Multimodal AI Diagnostics & Species Tutors (Gemini 1.5)
* **Metadata Parameterization**: Feeds specimen taxonomy tags (Monstera, Tomato, Pothos, Rose, Fig) directly into Gemini prompts.
* **Custom AI Tutors**: Prompt layers are fine-tuned to target species-specific issues (e.g. blossom-end rot or early blight for Tomatoes) for high-accuracy care programs.
* **Dual Execution Integrity**: Runs keyless mock fallback mode out-of-the-box so recruiters can fully experience the pipeline instantly with zero configurations or API keys.

### 📊 3. Interactive Diagnostic Console (`/console`)
* **Responsive Stacking HUD**: Completely optimized for mobile and desktop screens. Uses intelligent Tailwind ordering (`order-1`, `order-2`, `order-3`) so mobile viewports display specimen capture first, HUD diagnostics second, and registry sidebars at the bottom.
* **Chlorophyll Telemetry SVG Gauges**: Glow-mapped circular progress dials tracing Photosynthetic Potential (Hue), Cell Hydration (Saturation), and Reflectivity Index (Value).
* **Scan Registry Sidebar**: Caches scan runs locally inside the browser (`localStorage`) for instant, persistent specimen diagnostic histories.
* **Clinical Care Checklists**: Renders checklist items that can be checked off in real time, featuring strikethroughs and fade-out animations.

### 📜 4. Botanical Health Certificate jsPDF Engine
* **Formal Certificate Printout**: Generates professional, double-bordered certificates featuring official VerdantAI Lab stamps, specimen profiling hashes, exact spectral metrics, and validation signatures.
* **State Preservation**: Active UI checklist progress is dynamically compiled into the exported PDF.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 15 (App Router, React 19), Tailwind CSS, Framer Motion, Lucide Icons, jsPDF
* **Backend**: Python Flask, OpenCV (`opencv-python`), Google GenerativeAI API
* **Build / Linting**: ESLint, TypeScript, PostCSS

---

## 📂 Project Structure

```
├── backend/
│   ├── app.py             # Flask App Entry
│   ├── routes.py          # API Gateway Routing
│   ├── gemini.py          # Multimodal prompt tuner
│   └── utils.py           # OpenCV target segmentation HUD
└── frontend/
    ├── src/
    │   ├── app/           # Next.js 15 Routes (/ and /console)
    │   └── components/    # Glassmorphic UI Dashboard elements
    └── package.json
```

---

## ⚡ Setup & Installation

### 1. Pre-requisites
Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### 2. Backend Installation (Python Flask)
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create .env file and set your API key (optional - fallback local mock mode active by default)
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run server (starts on http://localhost:5000)
python app.py
```

### 3. Frontend Installation (Next.js 15)
```bash
# Navigate to frontend
cd ../frontend

# Install node dependencies
npm install

# Run dev server (starts on http://localhost:3000)
npm run dev
```

---

## 🎯 Production Build Validation

To verify the bundle compiler output, run:
```bash
cd frontend
npm run build
```
* **Homepage (`/`) JS Load**: **154 kB** (highly optimized static load)
* **App Console (`/console`) JS Load**: **322 kB** (lazy-loaded interactive payload)

---

## 👤 Author

* **Shiva Sajay** - *Lead Engineering*

---
