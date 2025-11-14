# 🚀 Deploy WITHOUT GitHub - Alternative Methods

## Option 1: Vercel CLI (Direct Upload) ⭐ EASIEST

### Backend on Render (GitHub required for Render)
*Unfortunately, Render requires GitHub. But see Option 2 below for alternatives.*

### Frontend on Vercel (No GitHub needed!)

**Step 1: Install Vercel CLI**
```powershell
npm install -g vercel
```

**Step 2: Login to Vercel**
```powershell
vercel login
```
(Opens browser - sign up with email/Google)

**Step 3: Deploy Frontend**
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui

# Set environment variables
vercel env add REACT_APP_API_URL
# Enter value when prompted: http://127.0.0.1:5000 (change later)

vercel env add REACT_APP_FIREBASE_API_KEY
# Paste your Firebase API key

vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN
# Paste your Firebase auth domain

# ... repeat for all 8 variables

# Deploy!
vercel --prod
```

**Done!** Your frontend is live at the URL shown! 🎉

---

## Option 2: Netlify Drop (Drag & Drop) 🖱️ SIMPLEST

### Frontend on Netlify (No GitHub, No CLI!)

**Step 1: Build Your App**
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui

# Create .env file first with your keys
# (See QUICK_REFERENCE.md for list)

npm run build
```

This creates a `build` folder.

**Step 2: Upload to Netlify**
1. Go to: https://app.netlify.com/drop
2. **Drag & drop** the entire `build` folder
3. Done! Site is live instantly! 🎉

**Step 3: Add Environment Variables**
1. Click on your site
2. Go to **Site settings** → **Environment variables**
3. Add all 8 variables:
   ```
   REACT_APP_API_URL
   REACT_APP_FIREBASE_API_KEY
   REACT_APP_FIREBASE_AUTH_DOMAIN
   REACT_APP_FIREBASE_PROJECT_ID
   REACT_APP_FIREBASE_STORAGE_BUCKET
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID
   REACT_APP_FIREBASE_APP_ID
   REACT_APP_GEMINI_API_KEY
   ```
4. Click **"Deploy settings"** → **"Trigger deploy"**

**Free tier**: 100GB bandwidth/month ✅

---

## Option 3: PythonAnywhere (All-in-One) 🐍

### Host BOTH Backend + Frontend on PythonAnywhere

**Step 1: Sign Up**
- Go to: https://www.pythonanywhere.com
- Create FREE account (no credit card!)

**Step 2: Upload Files**
1. Go to **Files** tab
2. Click **"Upload a file"**
3. Upload your `backend` folder files:
   - `api_server.py`
   - `day_model.pkl`
   - `hour_model.pkl`
   - `requirements.txt`

**Step 3: Setup Backend**
1. Go to **Web** tab
2. Click **"Add a new web app"**
3. Choose **Flask**
4. Python version: **3.10**
5. Edit WSGI file:
   ```python
   from api_server import app as application
   ```
6. Go to **Consoles** tab → Start bash console:
   ```bash
   pip install -r requirements.txt
   ```
7. Reload web app

**Your backend is live!** `https://yourusername.pythonanywhere.com`

**Step 4: Frontend**
Upload your built React app to the `static` folder and configure Flask to serve it.

**Free tier**: 1 web app, 512MB storage ✅

---

## Option 4: Railway (Direct Deploy) 🚂

### Backend on Railway (No GitHub!)

**Step 1: Install Railway CLI**
```powershell
npm install -g @railway/cli
```

**Step 2: Login**
```powershell
railway login
```

**Step 3: Deploy Backend**
```powershell
cd C:\Users\Krutika\Projects\RideWise\backend
railway init
railway up
```

**Step 4: Add Domain**
```powershell
railway domain
```

Copy the URL provided!

**Free tier**: $5 credit/month (enough for small projects) ✅

---

## Option 5: Heroku CLI (No GitHub) 💜

### Both Frontend & Backend on Heroku

**Step 1: Install Heroku CLI**
Download from: https://devcli.heroku.com/install

**Step 2: Login**
```powershell
heroku login
```

**Step 3: Deploy Backend**
```powershell
cd C:\Users\Krutika\Projects\RideWise\backend

# Initialize git locally (doesn't go to GitHub)
git init
git add .
git commit -m "Initial commit"

# Create Heroku app
heroku create ridewise-backend

# Deploy
git push heroku main
```

**Your backend is live!** `https://ridewise-backend.herokuapp.com`

**Step 4: Deploy Frontend**
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui

# Add environment variables
heroku config:set REACT_APP_API_URL=https://ridewise-backend.herokuapp.com
heroku config:set REACT_APP_FIREBASE_API_KEY=your_key
# ... (add all 8 variables)

git init
git add .
git commit -m "Initial commit"
heroku create ridewise-frontend
heroku buildpacks:add heroku/nodejs
git push heroku main
```

**Note**: Heroku free tier ended in Nov 2022. Cheapest plan is $5/month.

---

## Option 6: Firebase Hosting (Google) 🔥

### Frontend on Firebase (No GitHub!)

**Step 1: Install Firebase CLI**
```powershell
npm install -g firebase-tools
```

**Step 2: Login**
```powershell
firebase login
```

**Step 3: Initialize**
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui
firebase init hosting
```

Choose:
- Create new project or use existing
- Public directory: **build**
- Single-page app: **Yes**
- GitHub: **No**

**Step 4: Build and Deploy**
```powershell
npm run build
firebase deploy
```

**Your app is live!** `https://your-project.web.app`

**Free tier**: 10GB storage, 360MB/day transfer ✅

---

## 🎯 RECOMMENDED Without GitHub

### Best FREE Option:

**Frontend**: 
- **Netlify Drop** (drag & drop `build` folder)
  - Or **Vercel CLI** (command line upload)
  - Or **Firebase Hosting**

**Backend**: 
- **PythonAnywhere** (upload files directly)
  - Or **Railway CLI** (command line deploy)

### Why These?
✅ No GitHub account needed  
✅ 100% FREE  
✅ Simple upload/CLI commands  
✅ Good performance  

---

## 📋 Step-by-Step Without GitHub

### Quick Deploy (15 minutes):

**1. Deploy Frontend to Netlify:**
```powershell
cd C:\Users\Krutika\Projects\RideWise\frontend\ridewise-ui
npm run build
```
Then drag `build` folder to: https://app.netlify.com/drop

**2. Deploy Backend to PythonAnywhere:**
- Sign up: https://pythonanywhere.com
- Upload backend files (Files tab)
- Create Flask web app (Web tab)
- Install requirements (Console tab)

**3. Update Frontend:**
- In Netlify: Site settings → Environment variables
- Add `REACT_APP_API_URL` = your PythonAnywhere URL
- Trigger redeploy

**Done!** Both are live without GitHub! 🎉

---

## 💰 Costs Without GitHub

| Service | Method | Cost |
|---------|--------|------|
| **Netlify** | Drag & drop | FREE |
| **Vercel** | CLI upload | FREE |
| **Firebase** | CLI deploy | FREE |
| **PythonAnywhere** | File upload | FREE |
| **Railway** | CLI deploy | $5 credit/month |

**Total: $0/month** ✅

---

## 🔧 Update Without GitHub

When you make changes:

**Netlify Drop:**
```powershell
npm run build
# Drag new build folder to Netlify
```

**Vercel CLI:**
```powershell
vercel --prod
```

**PythonAnywhere:**
- Upload changed files via Files tab
- Reload web app

---

## ❓ Which Should You Choose?

**Easiest (No commands):**  
→ **Netlify Drop** for frontend  
→ **PythonAnywhere** for backend

**Most Professional:**  
→ **Vercel CLI** for frontend  
→ **Railway CLI** for backend

**All Google Ecosystem:**  
→ **Firebase Hosting** for frontend  
→ **Google Cloud Run** for backend (requires credit card)

---

**Need help with any specific method?** Let me know which option you prefer! 🚀
