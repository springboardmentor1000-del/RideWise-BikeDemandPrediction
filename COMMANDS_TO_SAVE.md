# 📝 RideWise - Important Commands & Setup

## 🔥 MUST SAVE - Environment Variables

### Frontend (.env file location: `frontend/ridewise-ui/.env`)
```env
# Firebase Configuration (Get from: https://console.firebase.google.com)
REACT_APP_FIREBASE_API_KEY=your_actual_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI (Get from: https://makersuite.google.com/app/apikey)
REACT_APP_GEMINI_API_KEY=your_actual_gemini_api_key

# Backend API URL
REACT_APP_API_URL=http://127.0.0.1:5000  # Local development
# REACT_APP_API_URL=https://your-app.onrender.com  # Production (uncomment after deploying)
```

---

## 💻 Local Development Commands

### Run Backend (Flask API)
```powershell
cd C:\Users\Krutika\Projects\RideWise\backend
python api_server.py
```
Server runs on: **http://127.0.0.1:5000**

### Run Frontend (React)
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui
npm start
```
App runs on: **http://localhost:3000**

---

## 🚀 FREE HOSTING GUIDE (Render + Vercel)

### Step 1: Deploy Backend to Render (FREE)

1. **Push to GitHub First:**
```powershell
cd C:\Users\Krutika\Projects\RideWise
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ridewise.git
git push -u origin main
```

2. **Deploy on Render:**
   - Go to: https://render.com
   - Click "Sign Up" (use GitHub account - it's FREE)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: ridewise-backend
     - **Region**: Choose closest to you
     - **Root Directory**: `backend`
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn api_server:app`
     - **Instance Type**: FREE
   - Click "Create Web Service"
   - **SAVE THIS URL**: `https://ridewise-backend-xxxx.onrender.com`

3. **Important Notes:**
   - FREE tier sleeps after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds to wake up
   - Good enough for portfolio/demo projects!

---

### Step 2: Deploy Frontend to Vercel (FREE)

1. **Go to Vercel:**
   - Visit: https://vercel.com
   - Click "Sign Up" (use GitHub account - FREE forever)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Create React App
     - **Root Directory**: `frontend/ridewise-ui`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   REACT_APP_API_URL = https://ridewise-backend-xxxx.onrender.com
   REACT_APP_FIREBASE_API_KEY = your_firebase_key
   REACT_APP_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID = your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
   REACT_APP_FIREBASE_APP_ID = your_app_id
   REACT_APP_GEMINI_API_KEY = your_gemini_key
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes
   - **Your app is LIVE!** 🎉
   - URL will be: `https://your-app-name.vercel.app`

---

## 📋 Post-Deployment Checklist

### After Backend is Deployed:
1. Copy Render backend URL
2. Update `REACT_APP_API_URL` in Vercel environment variables
3. Redeploy frontend on Vercel

### Test Your Live App:
- [ ] Can you login/signup? (Firebase Auth working)
- [ ] Can you make predictions? (Backend API working)
- [ ] Does chatbot respond? (Gemini API working)
- [ ] Are charts displaying? (Frontend working)

---

## 🔧 Troubleshooting

### Backend Issue: "Application Error"
- Check Render logs: Dashboard → Your Service → Logs
- Verify `day_model.pkl` and `hour_model.pkl` are in backend folder
- Check `requirements.txt` has all dependencies

### Frontend Issue: "API Error"
- Verify `REACT_APP_API_URL` in Vercel matches Render URL
- Wait 30 seconds (Render free tier wakes up from sleep)
- Check browser console for errors

### Chatbot Not Working:
- Verify `REACT_APP_GEMINI_API_KEY` is set in Vercel
- Check Gemini API quota at: https://makersuite.google.com

### Firebase Auth Not Working:
- Go to Firebase Console → Authentication → Settings
- Add your Vercel domain to "Authorized domains"
- Example: `your-app-name.vercel.app`

---

## 💰 Hosting Costs: $0/month

| Service | Plan | Cost | Limits |
|---------|------|------|--------|
| **Render** (Backend) | Free | $0 | Sleeps after 15min, 750 hours/month |
| **Vercel** (Frontend) | Hobby | $0 | 100GB bandwidth, unlimited sites |
| **Firebase** (Auth) | Spark | $0 | 10K phone auth, 50K email auth/month |
| **Gemini** (AI) | Free | $0 | 60 requests/minute |

**Total: $0/month** ✅

---

## 🎯 Quick Reference

### GitHub Commands:
```powershell
# First time setup
git init
git add .
git commit -m "Your message"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# Update after changes
git add .
git commit -m "Updated features"
git push
```

### Update Backend After Changes:
1. Push to GitHub: `git push`
2. Render auto-deploys (check logs)
3. Done! ✅

### Update Frontend After Changes:
1. Push to GitHub: `git push`
2. Vercel auto-deploys
3. Done! ✅

---

## 📞 Support Links

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Firebase Console**: https://console.firebase.google.com
- **Gemini API Keys**: https://makersuite.google.com/app/apikey
- **GitHub Help**: https://docs.github.com

---

## ⚡ One-Command Deployment (After GitHub setup)

Just push to GitHub, and both Vercel and Render will auto-deploy:
```powershell
git add .
git commit -m "Update"
git push
```

That's it! 🚀
