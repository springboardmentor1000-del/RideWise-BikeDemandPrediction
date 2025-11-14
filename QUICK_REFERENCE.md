# ⚡ QUICK REFERENCE CARD - Save This!

## 🔑 Your API Keys (SAVE THESE!)

### Firebase Keys (Get from: https://console.firebase.google.com)
```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

### Gemini AI (Get from: https://makersuite.google.com/app/apikey)
```
REACT_APP_GEMINI_API_KEY=
```

---

## 💻 Run Locally

```powershell
# Backend (Terminal 1)
cd C:\Users\Krutika\Projects\RideWise\backend
python api_server.py

# Frontend (Terminal 2)
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui
npm start
```

---

## 🚀 Deploy (FREE - 15 minutes)

### 1. GitHub (one-time)
```powershell
cd C:\Users\Krutika\Projects\RideWise
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ridewise.git
git push -u origin main
```

### 2. Backend → Render.com
- Sign up: https://render.com
- New Web Service → GitHub repo
- Root: `backend`
- Build: `pip install -r requirements.txt`
- Start: `gunicorn api_server:app`
- Instance: **FREE**
- **SAVE URL**: `https://ridewise-backend-xxxx.onrender.com`

### 3. Frontend → Vercel
- Sign up: https://vercel.com
- Import GitHub repo
- Root: `frontend/ridewise-ui`
- Add 8 environment variables (including Render URL)
- Deploy!

---

## 📁 File Structure (Clean & Simple)

```
RideWise/
├── START_HERE.md              ← Read this first!
├── FREE_HOSTING_GUIDE.md      ← Deploy guide
├── COMMANDS_TO_SAVE.md        ← All commands
├── backend/
│   ├── api_server.py         (Flask API)
│   ├── day_model.pkl         (ML model)
│   └── hour_model.pkl        (ML model)
└── frontend/ridewise-ui/
    ├── .env                  (CREATE THIS with your keys!)
    └── src/
        └── EnhancedDashboard.jsx
```

---

## 🔧 Update After Changes

```powershell
git add .
git commit -m "Your update message"
git push
```
Auto-deploys to both Render & Vercel! ✨

---

## 📞 Important Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Firebase Console**: https://console.firebase.google.com
- **Gemini API**: https://makersuite.google.com/app/apikey

---

## ✅ Deployment Checklist

- [ ] Saved Firebase keys (6 values)
- [ ] Saved Gemini API key
- [ ] Created GitHub repo
- [ ] Deployed backend on Render (got URL)
- [ ] Deployed frontend on Vercel (added 8 env vars)
- [ ] Added Vercel domain to Firebase Authorized Domains
- [ ] Tested: Login, Predictions, Chatbot working

---

## 💰 Cost: $0/month Forever

All services have generous free tiers for portfolio projects!

---

**Need detailed guide?** Open `FREE_HOSTING_GUIDE.md` ⭐
