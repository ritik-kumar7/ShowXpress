# 🚀 Vercel Deployment Guide - ShowXpress

## 📋 Prerequisites

- Vercel account
- GitHub repository with your code
- MongoDB Atlas database
- All API keys (Clerk, Stripe, TMDB, Inngest)

---

## 🎯 Deployment Strategy

You have **TWO options** for deploying on Vercel:

### **Option 1: Separate Deployments (Recommended)**
- Deploy frontend and backend as **separate projects**
- Easier to manage and debug
- Better for scaling

### **Option 2: Monorepo Deployment**
- Deploy both from **one repository**
- Single deployment process
- More complex configuration

---

## ✅ Option 1: Separate Deployments (RECOMMENDED)

### **Step 1: Deploy Backend**

1. **Go to Vercel Dashboard**
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Backend Project**
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   MONGO_URI=your_mongodb_uri
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   TMDB_API_KEY=your_tmdb_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=5000
   ```

4. **Deploy**
   - Click "Deploy"
   - Note your backend URL: `https://your-backend.vercel.app`

---

### **Step 2: Deploy Frontend**

1. **Create New Project**
   - Click "Add New Project"
   - Import same GitHub repository

2. **Configure Frontend Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   ```
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Your frontend URL: `https://your-frontend.vercel.app`

---

## 🔧 Fix 404 Errors on Routes

### **Frontend 404 Fix**

The `_redirects` file is already created in `frontend/public/_redirects`:
```
/*    /index.html   200
```

This tells Vercel to serve `index.html` for all routes (needed for React Router).

### **Backend 404 Fix**

The `backend/vercel.json` is already configured:
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

---

## 🌐 Update CORS Settings

After deployment, update your backend CORS to allow your frontend domain:

**File**: `backend/server.js`

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://your-frontend.vercel.app'  // Add your frontend URL
    ],
    credentials: true
}));
```

---

## 🔐 Update Clerk Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Go to your application
3. **Add Allowed Origins**:
   - `https://your-frontend.vercel.app`
4. **Add Redirect URLs**:
   - `https://your-frontend.vercel.app/*`

---

## 💳 Update Stripe Settings

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Add Webhook Endpoint** (if using webhooks):
   - URL: `https://your-backend.vercel.app/api/payment/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## ✅ Deployment Checklist

### **Before Deploying:**
- [ ] All environment variables ready
- [ ] MongoDB Atlas IP whitelist set to `0.0.0.0/0` (allow all)
- [ ] Clerk domain configured
- [ ] Stripe keys (publishable and secret)
- [ ] TMDB API key
- [ ] Inngest keys

### **After Backend Deployment:**
- [ ] Test API endpoints: `https://your-backend.vercel.app/api/show/now-playing`
- [ ] Check backend logs in Vercel dashboard
- [ ] Verify MongoDB connection

### **After Frontend Deployment:**
- [ ] Update `VITE_API_URL` with backend URL
- [ ] Test all routes (`/`, `/movies`, `/admin`, etc.)
- [ ] Test authentication (sign in/sign up)
- [ ] Test booking flow
- [ ] Test payment integration

---

## 🐛 Common Issues & Fixes

### **Issue 1: 404 on `/admin` or other routes**
**Solution**: 
- Make sure `_redirects` file exists in `frontend/public/`
- Redeploy frontend

### **Issue 2: Backend API calls failing**
**Solution**:
- Check `VITE_API_URL` in frontend environment variables
- Should be: `https://your-backend.vercel.app/api`
- Make sure no trailing slash

### **Issue 3: CORS errors**
**Solution**:
- Add frontend URL to CORS origins in `backend/server.js`
- Redeploy backend

### **Issue 4: MongoDB connection failed**
**Solution**:
- Check MongoDB Atlas IP whitelist
- Add `0.0.0.0/0` to allow all IPs
- Verify `MONGO_URI` in backend environment variables

### **Issue 5: Clerk authentication not working**
**Solution**:
- Add frontend URL to Clerk allowed origins
- Update redirect URLs in Clerk dashboard

### **Issue 6: Stripe payments failing**
**Solution**:
- Verify `STRIPE_SECRET_KEY` in backend
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` in frontend
- Check Stripe dashboard for errors

---

## 📝 Environment Variables Summary

### **Backend (.env)**
```env
MONGO_URI=mongodb+srv://...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=signkey-...
TMDB_API_KEY=...
STRIPE_SECRET_KEY=sk_test_...
PORT=5000
```

### **Frontend (.env)**
```env
VITE_API_URL=https://your-backend.vercel.app/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🎉 Success!

Once deployed, your app will be live at:
- **Frontend**: `https://your-frontend.vercel.app`
- **Backend**: `https://your-backend.vercel.app`

Test all features:
1. Browse movies ✅
2. Sign in/Sign up ✅
3. Select seats ✅
4. Make payment ✅
5. Download receipt ✅
6. View bookings ✅
7. Admin dashboard ✅

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables
4. Test API endpoints directly
5. Check MongoDB Atlas connection

**Your ShowXpress app is now live!** 🎬🚀
