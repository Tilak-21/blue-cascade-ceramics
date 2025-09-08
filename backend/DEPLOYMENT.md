# Backend Deployment Guide

## Production Deployment Setup

Your frontend is now configured to work with both local development and production. Here's what you need to set up:

### Option 1: Deploy backend to `/api` path on main domain

1. **Upload backend files to your cPanel**:
   - Upload the entire `backend/` folder to your web hosting
   - Place it in a subdirectory like `api/` in your public_html

2. **Install dependencies**:
   ```bash
   cd api
   npm install --production
   ```

3. **Set up environment variables**:
   Create `.env` file in your backend directory:
   ```env
   NODE_ENV=production
   PORT=5001
   DATABASE_URL="file:./prod.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   ```

4. **Initialize database**:
   ```bash
   npx prisma generate
   npx prisma db push
   node import-all-40.js
   ```

5. **Configure web server**:
   Add to your `.htaccess` file to proxy API requests:
   ```apache
   RewriteEngine On
   
   # Proxy API requests to Node.js backend
   RewriteCond %{REQUEST_URI} ^/api/
   RewriteRule ^api/(.*)$ http://localhost:5001/api/$1 [P,L]
   ```

6. **Start the backend server**:
   ```bash
   npm start
   ```

### Option 2: Use subdomain (api.bluecascadeceramics.com)

1. Create subdomain `api.bluecascadeceramics.com` in cPanel
2. Upload backend files to the subdomain folder
3. Update `.env.production` to use `https://api.bluecascadeceramics.com`
4. Follow steps 2-6 from Option 1

### Testing the Setup

After deployment, test the API endpoints:
- `https://www.bluecascadeceramics.com/api/tiles` - Should return tile data
- `https://www.bluecascadeceramics.com/api/auth/login` - Should accept admin login

### Environment Configuration

The frontend will automatically use:
- **Development**: `http://localhost:5001` 
- **Production**: `https://www.bluecascadeceramics.com/api`

This is configured in `src/config/api.js` and environment files.

### Troubleshooting

If admin login still shows "failed to fetch":
1. Check that your backend is running on the server
2. Verify the API URL is accessible from browser
3. Check server logs for any errors
4. Ensure CORS is properly configured in your backend