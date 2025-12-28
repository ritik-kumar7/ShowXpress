# ✅ Quick Fix for Vercel Deployment Issues

## 🔴 Your Current Issues:

1. ❌ `/admin` route returns 404
2. ❌ Backend API calls failing

---

## ✅ Immediate Fixes:

### **1. Fix Frontend 404 Errors**

**File created**: `frontend/public/_redirects`
```
/*    /index.html   200
```

**Action**: Redeploy your frontend on Vercel

---

### **2. Fix Backend Routes**

**File created**: `backend/vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

**Action**: Redeploy your backend on Vercel

---

### **3. Update Frontend Environment Variable**

In Vercel Frontend Project Settings:

**Add/Update**:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

Replace `your-backend-url` with your actual backend Vercel URL.

**Action**: 
1. Go to Vercel Dashboard → Your Frontend Project
2. Settings → Environment Variables
3. Update `VITE_API_URL`
4. Redeploy

---

### **4. Update Backend CORS**

**File**: `backend/server.js`

Find the CORS section and update:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://your-frontend-url.vercel.app'  // ADD THIS
    ],
    credentials: true
}));
```

Replace `your-frontend-url` with your actual frontend Vercel URL.

**Action**: Commit and push changes, Vercel will auto-deploy

---

## 🎯 Step-by-Step Fix Process:

### **Step 1: Commit New Files**
```bash
git add .
git commit -m "Add Vercel deployment configs"
git push
```

### **Step 2: Redeploy Backend**
1. Go to Vercel Dashboard
2. Find your backend project
3. Click "Redeploy"
4. Wait for deployment to complete
5. **Copy the backend URL**

### **Step 3: Update Frontend Environment**
1. Go to Vercel Dashboard
2. Find your frontend project
3. Go to Settings → Environment Variables
4. Update `VITE_API_URL` with backend URL from Step 2
5. Example: `https://showxpress-backend.vercel.app/api`

### **Step 4: Redeploy Frontend**
1. In frontend project
2. Click "Redeploy"
3. Wait for deployment

### **Step 5: Test**
1. Open your frontend URL
2. Try navigating to `/admin`
3. Should work now! ✅

---

## 🐛 If Still Not Working:

### **Check Backend Logs:**
1. Vercel Dashboard → Backend Project
2. Click on latest deployment
3. Go to "Functions" tab
4. Check for errors

### **Check Frontend Console:**
1. Open your deployed site
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors

### **Common Errors:**

**Error**: `Failed to fetch`
**Fix**: Update `VITE_API_URL` in frontend environment variables

**Error**: `CORS policy`
**Fix**: Add frontend URL to CORS origins in `backend/server.js`

**Error**: `404 on /admin`
**Fix**: Make sure `_redirects` file exists and redeploy

---

## 📋 Files Created:

✅ `vercel.json` (root) - Monorepo config  
✅ `backend/vercel.json` - Backend config  
✅ `frontend/public/_redirects` - Frontend routing fix  
✅ `netlify.toml` - Netlify config (if needed)  
✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Full guide  

---

## 🎉 After Fixes:

Your app should work perfectly:
- ✅ All routes accessible (`/`, `/movies`, `/admin`, etc.)
- ✅ Backend API calls working
- ✅ Authentication working
- ✅ Payments working
- ✅ Everything functional!

**Good luck with your deployment!** 🚀
