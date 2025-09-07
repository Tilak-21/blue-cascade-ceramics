# cPanel Deployment Guide for Blue Cascade Ceramics

## 🚀 Quick Testing (Local Development)

### 1. Verify Backend is Running
```bash
# Test backend API
curl http://localhost:5001/api
curl http://localhost:5001/health
curl http://localhost:5001/api/tiles
```

### 2. Verify Frontend is Running
- Open browser: `http://localhost:3000`
- Look for **Admin** button in the header (next to phone number)
- Click Admin button → should open login modal
- Login credentials: `admin / CascadeTiles2024!`

### 3. If Admin Button is Not Visible
```bash
# Clear browser cache or try incognito mode
# Or force refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

# Check if frontend compiled correctly:
npm run build
```

## 📱 cPanel Deployment Steps

### Phase 1: Frontend Deployment

1. **Build Production Frontend**
```bash
npm run build
```

2. **Upload Build Files to cPanel**
- Upload contents of `build/` folder to your domain's `public_html/` directory
- Make sure `index.html` is in the root of `public_html/`

3. **Update API URLs for Production**
Before building, update these files to use your production backend URL:
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

### Phase 2: Backend Deployment

#### Option A: Node.js App (Recommended)
If your cPanel supports Node.js apps:

1. **Create Node.js App in cPanel**
   - Go to Node.js Apps in cPanel
   - Create new app with Node.js version 18+
   - Set startup file: `server.js`
   - Set app directory to `/backend`

2. **Upload Backend Files**
   - Upload entire `backend/` folder via File Manager
   - Install dependencies: `npm install`

3. **Configure Environment**
   - Create `.env` file in backend directory:
   ```env
   DATABASE_URL="file:./production.db"
   JWT_SECRET="your-production-jwt-secret-change-me"
   ADMIN_USERNAME="admin"
   ADMIN_PASSWORD="CascadeTiles2024!"
   PORT=3000
   NODE_ENV="production"
   FRONTEND_URL="https://yourdomain.com"
   ```

4. **Setup Database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

#### Option B: PHP Backend (Alternative)
If Node.js is not available, create a PHP API wrapper:

1. **Create API Endpoints**
   - `api/tiles.php` - Get tiles data
   - `api/auth.php` - Handle authentication  
   - `api/admin.php` - Admin operations

2. **Use MySQL Database**
   - Create database in cPanel
   - Import tile data from SQLite to MySQL

### Phase 3: Configuration Updates

1. **Update CORS Settings**
Update `backend/server.js`:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'http://localhost:3000'],
  credentials: true
}));
```

2. **SSL/HTTPS Configuration**
Ensure all API calls use HTTPS in production.

3. **Database Migration**
For production, consider migrating from SQLite to MySQL:
```env
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

## 🔧 Troubleshooting

### Admin Button Not Showing
1. **Check Browser Console** (F12)
   - Look for JavaScript errors
   - Check if React app loaded correctly

2. **Clear Browser Cache**
   - Hard refresh: Ctrl+Shift+R
   - Or use incognito mode

3. **Verify Build**
   ```bash
   npm run build
   # Check if build/static/js contains the updated code
   ```

### Backend Not Working
1. **Check API Endpoints**
   ```bash
   curl https://yourdomain.com/api/health
   curl https://yourdomain.com/api/tiles
   ```

2. **Check Node.js Logs**
   - In cPanel Node.js Apps, check application logs
   - Look for port conflicts or permission issues

3. **Database Issues**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### Common cPanel Issues

1. **Port Conflicts**
   - cPanel may require specific ports
   - Check your hosting provider's Node.js documentation

2. **File Permissions**
   ```bash
   chmod 755 server.js
   chmod -R 755 node_modules
   ```

3. **Memory Limits**
   - Shared hosting may have memory restrictions
   - Consider upgrading to VPS if needed

## 📋 Pre-Deployment Checklist

- [ ] Backend API tested locally (`curl http://localhost:5001/api`)
- [ ] Frontend admin button visible locally
- [ ] Admin login working locally (`admin / CascadeTiles2024!`)
- [ ] API URLs updated for production
- [ ] Environment variables configured
- [ ] SSL certificate installed on domain
- [ ] Database setup completed
- [ ] CORS configured for production domain

## 🚀 Testing Deployed Version

1. **Visit your domain**
2. **Look for Admin button** in header (may be small on mobile)
3. **Test admin login** with credentials
4. **Check browser console** for any errors
5. **Test API directly**: `https://yourdomain.com/api`

## 📞 Need Help?

If deployment fails:
1. Check cPanel error logs
2. Test API endpoints individually
3. Verify file permissions and environment variables
4. Consider using staging subdomain first

---

**Credentials for Testing:**
- Username: `admin`
- Password: `CascadeTiles2024!`