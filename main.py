from __future__ import annotations
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle, re, os, ssl, gdown
from typing import Optional, List
from collections import Counter
import nltk

ssl._create_default_https_context = ssl._create_unverified_context
nltk.download("stopwords", quiet=True)
from nltk.corpus import stopwords
stop_words = set(stopwords.words("english"))

app = FastAPI(title="Brand Sentiment API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "sentiment_model.pkl"
MODEL_URL  = "https://drive.google.com/file/d/1S0ADPbLQz62lt7Fj207LdmZLZu55A4d6/view?usp=sharing"
model = None
vectorizer = None

@app.on_event("startup")
def load_model():
    global model, vectorizer
    if not os.path.exists(MODEL_PATH):
        print("Downloading model from Google Drive...")
        try:
            gdown.download(MODEL_URL, MODEL_PATH, fuzzy=True, quiet=False)
        except Exception as e:
            print(f"Download failed: {e}")
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, "rb") as f:
            bundle = pickle.load(f)
        model      = bundle["model"]
        vectorizer = bundle["vectorizer"]
        print("Model loaded successfully!")
    else:
        print("Model file not found after download attempt.")

def clean_tweet(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"@\w+", "", text)
    text = re.sub(r"#(\w+)", r"\1", text)
    text = re.sub(r"[^a-z\s]", "", text)
    text = " ".join(w for w in text.split() if w not in stop_words)
    return text.strip()

def _require_model():
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

class TweetRequest(BaseModel):
    text: str

class BrandRequest(BaseModel):
    keyword: str
    tweets: List[str]
    limit: Optional[int] = 500

@app.get("/")
def root():
    return {"status": "ok", "message": "Brand Sentiment API is running"}

@app.get("/health")
def health():
    return {"model_loaded": model is not None, "vectorizer_loaded": vectorizer is not None}

@app.post("/predict/tweet")
def predict_tweet(req: TweetRequest):
    _require_model()
    cleaned = clean_tweet(req.text)
    vec     = vectorizer.transform([cleaned])
    pred    = int(model.predict(vec)[0])
    proba   = model.predict_proba(vec)[0]
    return {
        "original":  req.text,
        "cleaned":   cleaned,
        "sentiment": "positive" if pred == 1 else "negative",
        "confidence": round(float(proba.max()) * 100, 1),
        "probabilities": {
            "negative": round(float(proba[0]) * 100, 1),
            "positive": round(float(proba[1]) * 100, 1),
        },
    }

@app.post("/predict/batch")
def predict_batch(req: List[TweetRequest]):
    _require_model()
    if len(req) > 1000:
        raise HTTPException(status_code=400, detail="Max 1000 tweets per batch.")
    texts   = [r.text for r in req]
    cleaned = [clean_tweet(t) for t in texts]
    vecs    = vectorizer.transform(cleaned)
    preds   = model.predict(vecs).tolist()
    probas  = model.predict_proba(vecs)
    return [
        {
            "original":  texts[i],
            "sentiment": "positive" if preds[i] == 1 else "negative",
            "confidence": round(float(probas[i].max()) * 100, 1),
        }
        for i in range(len(texts))
    ]

@app.post("/analyze/brand")
def analyze_brand(req: BrandRequest):
    _require_model()
    kw      = req.keyword.lower()
    matched = [t for t in req.tweets if kw in t.lower()][:req.limit]
    if not matched:
        raise HTTPException(status_code=404, detail=f"No tweets found containing '{req.keyword}'.")
    cleaned = [clean_tweet(t) for t in matched]
    vecs    = vectorizer.transform(cleaned)
    preds   = model.predict(vecs).tolist()
    probas  = model.predict_proba(vecs)
    total    = len(matched)
    positive = sum(preds)
    negative = total - positive
    score    = round(positive / total * 100, 1)
    pos_words = " ".join(cleaned[i] for i in range(total) if preds[i] == 1)
    top_words = [{"word": w, "count": c} for w, c in Counter(pos_words.split()).most_common(10)]
    conf_scores = [round(float(probas[i].max()) * 100, 1) for i in range(total)]
    buckets  = Counter(int(c // 10) * 10 for c in conf_scores)
    conf_dist = [{"bucket": f"{k}-{k+10}%", "count": v} for k, v in sorted(buckets.items())]
    return {
        "brand":             req.keyword,
        "total_mentions":    total,
        "positive":          positive,
        "negative":          negative,
        "reputation_score":  score,
        "sentiment_pct":     {"positive": score, "negative": round(100 - score, 1)},
        "top_positive_words": top_words,
        "confidence_distribution": conf_dist,
    }
