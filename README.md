# 📄 SkimLit Pro — Medical Abstract Classifier

SkimLit Pro is a full-stack web application that helps researchers and medical professionals quickly digest complex PubMed abstracts. A deep learning model classifies each sentence into one of five rhetorical roles: **BACKGROUND**, **OBJECTIVE**, **METHODS**, **RESULTS**, and **CONCLUSIONS** — with a confidence score per sentence.

---

## ✨ Features

- 🔬 **Sentence-level classification** of medical abstracts using a TensorFlow model trained on the RCT-20k dataset
- 🎨 **Colour-coded Highlighter** view — each sentence is highlighted by its predicted label
- 🌡️ **Confidence Heatmap** view — visualise model certainty across all sentences
- ⚡ **FastAPI backend** with async model loading and CORS support
- 🖥️ **React + Vite + Tailwind CSS** frontend

---

## 🗂️ Project Structure

```
skimlit/
├── backend/                  # FastAPI server & ML inference logic
│   ├── main.py               # App entry point; /predict, /compare, /export endpoints
│   ├── predict.py            # Model inference pipeline
│   ├── preprocess.py         # Text preprocessing utilities
│   ├── conftest.py           # pytest fixtures
│   ├── requirements.txt      # Python dependencies
│   └── tests/
│       └── test_main.py      # Automated API tests (pytest + httpx)
│
├── frontend/                 # React application (Vite)
│   ├── src/
│   │   ├── App.jsx           # Root component; handles state & API calls
│   │   └── components/
│   │       ├── Highlighter.jsx   # Colour-coded sentence view
│   │       └── Heatmap.jsx       # Confidence heatmap view
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── model/                    # Saved TensorFlow model (not tracked in git)
│   └── skimlit_model/        # Place your SavedModel directory here
│
├── pubmed-rct/               # Dataset used for model training
├── SkimLit.ipynb             # Model training & evaluation notebook
├── helper_functions.py       # Shared utility functions
└── implementation_plan.md    # Development roadmap
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- A trained model saved at `model/skimlit_model/` (TensorFlow SavedModel format)

---

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# Unix / macOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

> The backend will be available at **`http://localhost:8000`**

> **Note:** If no model is found at `model/skimlit_model/`, the server still starts but returns `500` on prediction endpoints.

---

### 2. Frontend Setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

> The frontend will be available at **`http://localhost:5173`**

---

## 🧪 Testing

### Automated Backend Tests (pytest)

```bash
# From the backend/ directory with the venv active
python -m pytest
```

Tests use `pytest` + `httpx` and are located in `backend/tests/test_main.py`.

---

### Manual API Testing

**Health check:**
```bash
curl http://localhost:8000/health
```
Response:
```json
{ "status": "ok", "model_loaded": true }
```

**Classify a single abstract:**
```bash
curl -X POST http://localhost:8000/predict \
     -H "Content-Type: application/json" \
     -d '{"abstract": "This study evaluated the effectiveness of a new drug. We enrolled 200 patients. Results showed a significant improvement. We conclude the drug is effective."}'
```

**Compare two abstracts:**
```bash
curl -X POST http://localhost:8000/compare \
     -H "Content-Type: application/json" \
     -d '{"abstract_a": "First abstract...", "abstract_b": "Second abstract..."}'
```

---

## 🔌 API Reference

### `GET /health`
Returns server and model status.

**Response:**
```json
{ "status": "ok", "model_loaded": true }
```

---

### `POST /predict`
Classifies all sentences in a medical abstract.

**Request body:**
```json
{ "abstract": "Full text of the abstract..." }
```

**Response:**
```json
{
  "sentences": [
    {
      "line_number": 0,
      "total_lines": 4,
      "text": "This study evaluated the effectiveness of a new drug.",
      "target": "OBJECTIVE",
      "confidence": 0.97
    }
  ]
}
```

---

### `POST /compare`
Runs `/predict` on two abstracts and returns both result sets.

**Request body:**
```json
{
  "abstract_a": "First abstract...",
  "abstract_b": "Second abstract..."
}
```

**Response:**
```json
{
  "a": [ /* sentences array */ ],
  "b": [ /* sentences array */ ]
}
```

---

### `POST /export` *(stub)*
Planned endpoint for exporting results to PDF or DOCX. Not yet implemented.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | FastAPI, Uvicorn |
| ML / Inference | TensorFlow, TensorFlow Hub, scikit-learn |
| Testing | pytest, httpx |
| Data | PubMed RCT-20k dataset |

---

## 📓 Model Training

The model is trained and evaluated in **`SkimLit.ipynb`** (and the earlier `skimlit notebook.ipynb`). After training, export the model using:

```python
model.save("../model/skimlit_model")
```

Then restart the backend server to pick it up automatically.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push and open a Pull Request
