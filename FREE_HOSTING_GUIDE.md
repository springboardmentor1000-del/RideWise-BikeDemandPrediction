# 🎯 FREE Hosting Guide - RideWise

## 📝 SAVE YOUR API KEYS FIRST!

Before starting, collect these:

1. **Firebase Keys**: https://console.firebase.google.com
   - Go to Project Settings → General → Your apps
   - Copy all 6 keys (API key, Auth Domain, Project ID, etc.)

2. **Gemini API Key**: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key

3. **GitHub Account**: https://github.com (free)

---

## 🚀 Deploy in 3 Steps (100% FREE)

### Step 1: Push to GitHub (5 minutes)

```powershell
# Open PowerShell in project folder
cd C:\Users\Krutika\Projects\RideWise

# Initialize Git
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create repo on GitHub.com (click + → New repository)
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/ridewise.git
git push -u origin main
```

---

### Step 2: Deploy Backend on Render (5 minutes)

1. **Go to**: https://render.com
2. **Sign Up** with GitHub (FREE forever)
3. Click **"New +"** → **"Web Service"**
4. **Select** your `ridewise` repository
5. **Fill Settings**:
   ```
   Name: ridewise-backend
   Region: Oregon (US West)
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn api_server:app
   Instance Type: Free
   ```
6. Click **"Create Web Service"**
7. **COPY THE URL**: `https://ridewise-backend-xxxx.onrender.com`
8. Save this URL - you need it for frontend!

**Important:** Free tier sleeps after 15 min. First request takes ~30 sec to wake up.

---

### Step 3: Deploy Frontend on Vercel (5 minutes)

1. **Go to**: https://vercel.com
2. **Sign Up** with GitHub (FREE forever)
3. Click **"Add New..."** → **"Project"**
4. **Import** your `ridewise` repository
5. **Configure**:
   ```
   Framework Preset: Create React App
   Root Directory: frontend/ridewise-ui
   Build Command: npm run build
   Output Directory: build
   ```

6. **Add Environment Variables** (click "Environment Variables"):
   ```
   REACT_APP_API_URL = https://ridewise-backend-xxxx.onrender.com
   REACT_APP_FIREBASE_API_KEY = your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN = your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID = your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET = your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 123456789
   REACT_APP_FIREBASE_APP_ID = 1:123456789:web:abc123
   REACT_APP_GEMINI_API_KEY = your_gemini_api_key
   ```

7. Click **"Deploy"**
8. Wait 2-3 minutes
9. **YOUR APP IS LIVE!** 🎉

---

## ✅ Final Step: Add Domain to Firebase

1. Go to: https://console.firebase.google.com
2. Select your project → **Authentication** → **Settings**
3. Scroll to **"Authorized domains"**
4. Click **"Add domain"**
5. Add your Vercel URL: `your-app-name.vercel.app`
6. Click **"Add"**

---

## 🎉 Done! Test Your App

Your app is live at: `https://your-app-name.vercel.app`

**Test Checklist:**
- [ ] Can you visit the URL?
- [ ] Can you signup/login?
- [ ] Can you make predictions?
- [ ] Does chatbot work?

---

## 🔧 If Something Breaks

### Backend Not Working:
- Go to Render Dashboard → Your Service → **Logs**
- Check for errors
- Make sure `day_model.pkl` and `hour_model.pkl` are in backend folder

### Frontend Not Working:
- Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
- Verify all 8 variables are set correctly
- Check `REACT_APP_API_URL` matches your Render URL

### Chatbot Not Working:
- Verify Gemini API key in Vercel environment variables
- Check quota: https://makersuite.google.com

### Login Not Working:
- Add Vercel domain to Firebase Authorized Domains (see above)

---

## 💰 Cost: $0/month

| Service | Free Tier Limits |
|---------|------------------|
| **Render** | 750 hours/month, sleeps after 15min |
| **Vercel** | 100GB bandwidth, unlimited deployments |
| **Firebase** | 10K phone + 50K email auth/month |
| **Gemini** | 60 requests/minute |

All limits are more than enough for portfolio/demo projects!

---

## 📱 Share Your App

Your live URL: `https://your-app-name.vercel.app`

Add to:
- Resume/CV
- LinkedIn projects
- GitHub README
- Portfolio website

---

## 🔄 Update Your App Later

When you make changes:
```powershell
cd C:\Users\Krutika\Projects\RideWise
git add .
git commit -m "Updated feature"
git push
```

Both Vercel and Render will **automatically redeploy**! ✨

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs/deploy-flask
- **Vercel Docs**: https://vercel.com/docs/concepts/deployments/overview
- **Firebase Docs**: https://firebase.google.com/docs/auth

---

**Total Time**: 15 minutes  
**Total Cost**: $0  
**Result**: Professional live app! 🚀
