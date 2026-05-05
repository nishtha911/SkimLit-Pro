# 📄 SkimLit: Medical Abstract Highlighter

SkimLit is a professional-grade web application designed to help researchers and medical professionals quickly digest complex PubMed abstracts. Using a deep learning model, SkimLit classifies sentences into categories like **BACKGROUND**, **OBJECTIVE**, **METHODS**, **RESULTS**, and **CONCLUSIONS**.

---

## 🚀 Getting Started

### 1. Backend Setup (FastAPI)
The backend serves the ML model and provides API endpoints for prediction.

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Unix/macOS
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup (React + Vite)
The frontend provides a modern, interactive interface for abstract analysis.

```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🧪 How to Test

### Backend Testing

#### Automated Tests
We use `pytest` for automated backend testing.
1. Ensure you are in the `backend` directory and your virtual environment is active.
2. Install test dependencies:
   ```bash
   pip install pytest httpx
   ```
3. Run the tests:
   ```bash
   python -m pytest
   ```

#### Manual API Testing
You can test the endpoints using `curl` or tools like Postman/Insomnia.

**Health Check:**
```bash
curl http://localhost:8000/health
```

**Prediction Endpoint:**
```bash
curl -X POST http://localhost:8000/predict \
     -H "Content-Type: application/json" \
     -d '{"abstract": "This study aims to evaluate the effectiveness of SkimLit. We used a deep learning model. Results showed high accuracy."}'
```

### Frontend Testing
1. **Linting:** Run `npm run lint` to check for code style issues.
2. **Visual Testing:** Open the app in your browser and verify:
   - Text input works correctly.
   - Highlights appear with correct colors.
   - Confidence heatmap is interactive.
   - Comparison view shows side-by-side results.

---

## 🔌 API Reference

### `POST /predict`
Classifies sentences in a single medical abstract.

**Request Body:**
```json
{
  "abstract": "Text of the abstract here..."
}
```

**Response:**
```json
{
  "sentences": [
    {
      "line_number": 0,
      "target": "OBJECTIVE",
      "text": "To investigate the efficacy of...",
      "total_lines": 5,
      "confidence": 0.98
    },
    ...
  ]
}
```

### `POST /compare`
Compares two abstracts side-by-side.

**Request Body:**
```json
{
  "abstract_a": "First abstract...",
  "abstract_b": "Second abstract..."
}
```

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend:** FastAPI, TensorFlow, Scikit-learn.
- **ML Model:** Custom-trained multi-modal model (RCT-20k).

---

## 📂 Project Structure
- `/backend`: FastAPI server and ML logic.
- `/frontend`: React application.
- `/pubmed-rct`: Dataset used for model training.
- `SkimLit.ipynb`: Model training notebook.
