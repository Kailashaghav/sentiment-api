# 💡 SentimentLens Pro

AI-Powered Real-Time Sentiment Analysis Dashboard 🚀
https://sentiment-frontend-ashen-three.vercel.app/
---

## 📌 Overview

SentimentLens Pro is a full-stack web application that performs real-time sentiment analysis using a machine learning model. Users can input text manually or via voice, and the system predicts whether the sentiment is Positive, Negative, or Neutral.

The application features an interactive dashboard with charts, geolocation tracking, and a modern UI.

---

## 🔥 Features

* 🔍 Real-time sentiment analysis
* 🎙 Voice input using Speech Recognition API
* 📊 Interactive charts using Chart.js
* 📍 Location-based tracking
* 🔐 Basic login system
* 🌐 FastAPI backend integration

---

## 🛠️ Tech Stack

**Frontend:** HTML, CSS, JavaScript
**Backend:** FastAPI (Python)
**Machine Learning:** Scikit-learn, NLP
**Visualization:** Chart.js

---

## 📂 Project Structure

```
sentiment-api/
│── main.py
│── requirements.txt
│── sentiment_model.pkl
│── index.html
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/sentimentlens-pro.git
cd sentimentlens-pro
```

### 2️⃣ Install Dependencies

```
pip install -r requirements.txt
```

### 3️⃣ Run Backend

```
uvicorn main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

### 4️⃣ Run Frontend

```
python3 -m http.server 5500
```

Open in browser:

```
http://localhost:5500
```

---

## 🧪 API Endpoint

### POST /predict

**Request:**

```
{
  "text": "I love this product"
}
```

**Response:**

```
{
  "sentiment": "positive"
}
```

---

## 📊 Screenshots

*Add screenshots here*

---

## 🚀 Future Enhancements

* 🌐 Deploy on cloud (Render / Railway)
* 📊 Advanced analytics dashboard
* 🔐 Secure authentication system
* ☁️ Database integration (Firebase / MongoDB)

---

## 💼 Author

**Kailash Aghav**

---

## ⭐ Show your support

Give a ⭐ if you like this project!
