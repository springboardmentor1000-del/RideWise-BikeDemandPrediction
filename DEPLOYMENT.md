# RideWise Deployment Guide

## 🚀 Quick Deploy (Recommended: Vercel)

### Prerequisites
- GitHub account
- Vercel account (free)
- Your Firebase & Gemini API keys ready

### Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Ready for deployment"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy Frontend (Vercel)**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework: Create React App
     - Root Directory: `frontend/ridewise-ui`
     - Build Command: `npm run build`
     - Output Directory: `build`
   - Add Environment Variables:
     - `REACT_APP_FIREBASE_API_KEY`
     - `REACT_APP_FIREBASE_AUTH_DOMAIN`
     - `REACT_APP_FIREBASE_PROJECT_ID`
     - `REACT_APP_FIREBASE_STORAGE_BUCKET`
     - `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
     - `REACT_APP_FIREBASE_APP_ID`
     - `REACT_APP_GEMINI_API_KEY`
   - Click "Deploy"

3. **Deploy Backend (Render)**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - Name: ridewise-backend
     - Root Directory: `backend`
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `gunicorn api_server:app`
   - Click "Create Web Service"

4. **Update Frontend API URL**:
   - Once backend is deployed, copy the URL (e.g., `https://ridewise-backend.onrender.com`)
   - Update in `EnhancedDashboard.jsx`:
     ```javascript
     const API_BASE_URL = 'https://your-backend-url.onrender.com';
     ```
   - Commit and push changes

---

## 🌐 Alternative Hosting Options

### Option A: Firebase Hosting (Frontend)
```bash
cd frontend/ridewise-ui
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Option B: Netlify (Frontend)
1. Build the app: `npm run build`
2. Drag & drop `build` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Configure environment variables in Site Settings

### Option C: Heroku (Full Stack)
```bash
# Backend
cd backend
heroku create ridewise-backend
git push heroku main

# Frontend
cd frontend/ridewise-ui
heroku create ridewise-frontend
heroku buildpacks:add heroku/nodejs
git push heroku main
```

---

## 🔧 Environment Variables Setup

### Frontend (.env)
```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### Backend
No environment variables needed currently (all models are local)

---

## ✅ Pre-Deployment Checklist

- [x] Backend `requirements.txt` created
- [x] Backend `Procfile` created (for Heroku/Render)
- [x] Backend `.gitignore` configured
- [x] ML models (`day_model.pkl`, `hour_model.pkl`) exist
- [ ] Firebase credentials configured
- [ ] Gemini API key configured
- [ ] GitHub repository created
- [ ] Environment variables set in hosting platform

---

## 🧪 Test Locally Before Deploy

### Backend:
```bash
cd backend
pip install -r requirements.txt
python api_server.py
```
Should run on http://127.0.0.1:5000

### Frontend:
```bash
cd frontend/ridewise-ui
npm install
npm start
```
Should run on http://localhost:3000

---

## 📊 Post-Deployment

1. **Update CORS** in `api_server.py`:
   ```python
   CORS(app, origins=["https://your-frontend-url.vercel.app"])
   ```

2. **Monitor Performance**:
   - Vercel Analytics (free)
   - Render Metrics dashboard
   - Firebase Analytics

3. **Custom Domain** (Optional):
   - Add custom domain in Vercel/Netlify settings
   - Update DNS records

---

## 🆘 Troubleshooting

**Error: Module not found**
- Run `npm install` or `pip install -r requirements.txt`

**Error: API not responding**
- Check backend URL in frontend code
- Verify CORS settings
- Check backend logs in hosting dashboard

**Error: Firebase auth not working**
- Verify all Firebase env variables are set
- Check Firebase Console → Authentication is enabled
- Verify authorized domains include your hosting URL

---

## 💰 Hosting Costs

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Vercel | ✅ 100GB bandwidth | $20/mo Pro |
| Netlify | ✅ 100GB bandwidth | $19/mo Pro |
| Render | ✅ 750 hours/month | $7/mo paid |
| Firebase | ✅ 10GB storage | Pay as you go |
| Heroku | ❌ (Ended Nov 2022) | $5/mo Eco |

**Recommended Setup (FREE):**
- Frontend: Vercel (Free)
- Backend: Render (Free - sleeps after 15min inactivity)
- Total Cost: $0/month

**Production Setup:**
- Frontend: Vercel Pro ($20/mo)
- Backend: Render Starter ($7/mo)
- Total Cost: $27/month
