# 🧪 Testing Guide - Backend & Admin Panel

## ✅ Quick Verification Checklist

### 1. Test Backend API (Must Work First)

```bash
# Test API health
curl http://localhost:5001/health

# Test API documentation  
curl http://localhost:5001/api

# Test public tiles endpoint
curl http://localhost:5001/api/tiles
```

**Expected Results:**
- Health endpoint: `{"status":"OK",...}`
- API endpoint: Lists all available endpoints with credentials
- Tiles endpoint: Returns tile data with pagination

### 2. Test Frontend Access

Visit: `http://localhost:3000`

**What to Look For:**
1. **Admin Button Location**:
   - **Desktop**: Top-right corner, next to phone number
   - **Mobile**: Top-right corner, small shield icon next to "Call" button
   
2. **Admin Button States**:
   - Gray/inactive when not logged in
   - Green when logged in as admin

### 3. Test Admin Login

1. **Click Admin Button** → Should open login modal
2. **Login Credentials**:
   - Username: `admin`
   - Password: `CascadeTiles2024`
3. **Expected Result**: Login modal closes, page refreshes to admin dashboard

### 4. Test Admin Dashboard

After successful login, you should see:
- Dashboard statistics (total tiles, inventory value, etc.)
- Tile management table
- "Add New Tile" button
- Logout button in top-right

## 🔍 Troubleshooting Common Issues

### Issue 1: "Admin Button Not Visible"

**Solutions:**
1. **Hard Refresh Browser**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`
   - Or use incognito/private browsing mode

2. **Check React Compilation**:
   ```bash
   # Stop and restart frontend
   # In terminal running npm start: Ctrl+C
   npm start
   ```

3. **Look Carefully**:
   - Desktop: Button says "Admin" next to phone number
   - Mobile: Small shield icon (🛡️) button

### Issue 2: "Cannot Connect to Backend"

**Solutions:**
1. **Verify Backend is Running**:
   ```bash
   # Check if port 5001 is in use
   lsof -i:5001
   
   # Start backend if not running
   cd backend
   npm run dev
   ```

2. **Check CORS Issues** (in browser console):
   - Open Developer Tools (F12)
   - Look for CORS errors in Console tab

3. **Test API Directly**:
   ```bash
   curl -v http://localhost:5001/api/tiles
   ```

### Issue 3: "Login Fails"

**Solutions:**
1. **Verify Credentials**:
   - Username: `admin` (lowercase)
   - Password: `CascadeTiles2024` (exact case and characters)

2. **Check Backend Logs**:
   - Look at terminal running `npm run dev` in backend
   - Look for authentication errors

3. **Test Auth Endpoint**:
   ```bash
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "test"}'
   ```
   (Should return error for wrong password)

## 📱 Mobile Testing

The admin button is **very small** on mobile devices:

1. **Look for shield icon (🛡️)** next to the "Call" button
2. **It's only about 24px wide** on mobile
3. **Test in portrait and landscape modes**

## 🌐 cPanel Deployment Testing

### Before Uploading to cPanel:

1. **Build Production Version**:
   ```bash
   npm run build
   ```

2. **Update API URLs** (Important!):
   
   Edit these files to use your production domain:
   - `src/components/AdminLogin.js` (line 19)
   - `src/components/AdminDashboard.js` (line 20)
   - `src/components/TileForm.js` (line 27)
   
   Change from:
   ```javascript
   const API_BASE = 'http://localhost:5001/api';
   ```
   
   To:
   ```javascript
   const API_BASE = 'https://yourdomain.com/api';
   ```

3. **Test Production Build Locally**:
   ```bash
   npx serve -s build -l 8080
   ```
   Visit: `http://localhost:8080`

### After Uploading to cPanel:

1. **Test Your Domain**: `https://yourdomain.com`
2. **Check API**: `https://yourdomain.com/api`
3. **Test Admin Login** with same credentials
4. **Check Browser Console** for any errors (F12)

## 🚨 Common Deployment Mistakes

1. **Forgetting to Update API URLs** → Frontend tries to call localhost from production
2. **Not Setting CORS Properly** → Backend blocks frontend requests
3. **Missing Environment Variables** → Backend authentication fails
4. **Wrong File Permissions** → cPanel can't execute Node.js files

## 📞 Current System Status

**Local Development URLs:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001/api`
- Health Check: `http://localhost:5001/health`

**Admin Credentials:**
- Username: `admin`
- Password: `CascadeTiles2024`

**Expected File Structure:**
```
cascade-tiles/
├── src/components/
│   ├── AdminLogin.js      ✅ Admin login modal
│   ├── AdminDashboard.js  ✅ Admin dashboard
│   ├── TileForm.js        ✅ Tile CRUD form
│   └── Header.js          ✅ Contains admin button
├── backend/
│   ├── server.js          ✅ Express server
│   ├── routes/            ✅ API endpoints
│   └── prisma/            ✅ Database schema
└── DEPLOYMENT_GUIDE.md    ✅ cPanel deployment steps
```

## 🎯 Quick Test Commands

```bash
# Test everything is working:
curl http://localhost:5001/health && echo "✅ Backend OK"
curl -s http://localhost:3000 | grep -q "Blue Cascade" && echo "✅ Frontend OK"
```

If both show "✅", your system is working correctly!