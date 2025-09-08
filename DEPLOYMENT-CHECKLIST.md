# 🚀 Complete Deployment Checklist

## Current Status
❌ **Admin Panel**: Not working - 404 errors on API calls  
❌ **Backend**: PHP backend not uploaded to server yet  
✅ **Frontend**: Deployed but missing backend  
✅ **Images**: All images are available in `/images/` folder  

## Step-by-Step Deployment

### ✅ Step 1: Upload PHP Backend to cPanel
1. **Download/Zip** the `backend-php/` folder from your project
2. **Login to cPanel** → File Manager
3. **Navigate** to `public_html/`  
4. **Upload** the `backend-php` folder
5. **Rename** `backend-php` to `api`
6. **Set permissions** to 755 for folders

**Result**: `public_html/api/` folder created

### ✅ Step 2: Import All Tiles Data  
1. **Visit**: `https://www.bluecascadeceramics.com/api/import/`
2. **Expected Output**:
   ```
   🚀 Starting PHP import of all 40 tiles...
   🧹 Clearing existing data...
   ✅ Imported 40 tiles
   📊 Total inventory: 456,417 units  
   💰 Total value: $9,172,603
   🎉 All 40 tiles imported successfully in PHP backend!
   ```

### ✅ Step 3: Test API Endpoints
**Test these URLs in browser:**
- `https://www.bluecascadeceramics.com/api/tiles/` ← Should return JSON with tiles
- `https://www.bluecascadeceramics.com/api/auth/login` ← Should return "Method not allowed" (normal)

### ✅ Step 4: Test Admin Login
1. **Visit**: `https://www.bluecascadeceramics.com`
2. **Click** admin login button
3. **Login** with:
   - Username: `admin`  
   - Password: `CascadeTiles2024`
4. **Should see**: Dashboard with 40 tiles, 456K units, $9M value

## 🔧 Troubleshooting

### Problem: Still getting 404 on `/api/auth/login`
**Solution**: Check that you renamed `backend-php` to `api` in cPanel

### Problem: Import page shows error  
**Solution**: 
- Check folder permissions (755)
- Make sure `.htaccess` file was uploaded
- Check if PHP is enabled on your hosting

### Problem: Images still 404
**Solution**: Make sure your `build/images/` folder is uploaded to `public_html/images/`

### Problem: Admin login form appears but fails
**Solution**: Check browser console - should NOT see 404 errors anymore

## 🎯 Success Indicators

✅ **API Working**: `https://www.bluecascadeceramics.com/api/tiles/` returns JSON  
✅ **Data Imported**: Import page shows "40 tiles imported"  
✅ **Login Works**: Admin panel loads with dashboard  
✅ **Images Load**: No 404 errors in browser console  
✅ **CRUD Operations**: Can add/edit/delete tiles in admin panel  

## 📂 Final File Structure
```
public_html/
├── api/                          ← PHP Backend
│   ├── .htaccess
│   ├── config/
│   ├── api/
│   ├── import/
│   └── data/tiles.db
├── images/                       ← Tile Images  
│   ├── mistrey.png
│   ├── calacatta_gold.png
│   └── ... (all tile images)
├── static/                       ← React Build Files
├── index.html                    ← Main Site
└── ... (other React build files)
```

Once you complete Steps 1-2, your admin panel should work perfectly!