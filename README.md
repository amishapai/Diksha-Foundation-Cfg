# 📚 Empowering Growth Beyond Grades

A full-stack web application built for the **Diksha Foundation** to help measure and nurture the **social-emotional development** of students in underserved communities.

Unlike traditional systems that focus purely on academic performance, this application brings together **machine learning**, **natural language understanding**, and **prompt-based AI feedback** to give students, teachers, and NGOs actionable insights on the **invisible aspects of growth** — like confidence, empathy, collaboration, and emotional well-being.

---

## 🌟 Key Features

- 🧠 **ML-Powered Sentiment & Emotion Detection**  
  Uses pretrained models (e.g. DistilBERT) to classify journal tone and peer feedback.

- 👥 **Peer Feedback Analysis**  
  Tracks social behavior like collaboration, empathy, and kindness.

- 📊 **Growth Dashboards for Teachers**  
  Visual insights into student progress across non-academic dimensions.

- ✨ **Gemini AI Feedback Generator**  
  Auto-generates personalized growth reports and emotional summaries.

- 🌐 **Multilingual Support (English + Hindi)**  
  Seamless Google Translate API integration for regional accessibility.

- 🛠️ **Role-Based Access**  
  Separate views and permissions for Students, Teachers, Volunteers, and Admins.

---

## 🧠 Architecture Overview

| Layer      | Tech Stack                              |
|------------|------------------------------------------|
| Frontend   | React.js (PWA-ready) + Tailwind CSS      |
| Backend    | Node.js + Express                        |
| ML Models  | DistilBERT (sentiment) + KMeans (clustering) |
| Prompt AI  | Google Gemini API (text summarization & insights) |
| Database   | MongoDB Atlas  |
| APIs Used  | Google Translate API, Gemini Pro via Vertex AI |

---

## ⚙️ Project Structure
/client → React frontend with multilingual support
/server → Node/Express backend API
/ml-models → Scripts for sentiment & clustering (HuggingFace)
/prompts → Gemini prompt templates
/data → Sample journal + feedback datasets


---

## 🚀 Setup Instructions

### 1. Clone the Repo
```bash
git clone "https://github.com/amishapai/Diksha-Foundation-Cfg.git"
cd Diksha-Foundation-Cfg
cd client && npm install
cd ../server && npm install

MONGO_URI=your-mongodb-uri
GEMINI_API_KEY=your-gemini-key
GOOGLE_TRANSLATE_API_KEY=your-key

# Run backend
cd server
npm run dev

# Run frontend
cd client
npm start
```
---

## 🔐 Authentication & Roles
-Student: Write journals, view feedback
-Teacher/Volunteer: View growth data, give feedback
-Admin: Manage users, export reports

---

##👥 Built For
Diksha Foundation – Code for Good 2025
By Team [Team 65] | J.P. Morgan Code for Good Hackathon

Open to NGOs, educators, and research collaborations.
