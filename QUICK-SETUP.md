# 🚀 Quick cPanel Setup for Admin Panel

## Step 1: Upload PHP Backend

1. **Download the backend-php folder** from your project
2. **Upload to cPanel**:
   - Go to cPanel → File Manager
   - Navigate to `public_html/`
   - Upload the entire `backend-php/` folder
   - **Rename it to `api`** (important!)

Your structure should look like:
```
public_html/
└── api/
    ├── .htaccess
    ├── config/
    ├── api/
    ├── import/
    └── data/ (will be created)
```

## Step 2: Import the Tiles Data

1. Visit this URL in your browser:
   ```
   https://www.bluecascadeceramics.com/api/import/
   ```

2. You should see:
   ```
   ✅ Imported 40 tiles
   📊 Total inventory: 456,417 units
   💰 Total value: $9,172,603
   🎉 All 40 tiles imported successfully in PHP backend!
   ```

## Step 3: Test Your Admin Login

1. Go to your website: `https://www.bluecascadeceramics.com`
2. Click the admin login (usually a small link in footer)
3. Login with:
   - **Username**: `admin`
   - **Password**: `CascadeTiles2024`

## ✅ That's It!

Your admin panel should now work perfectly with:
- All 40 tiles loaded
- 456K+ inventory units
- $9M+ total value
- Full CRUD operations

## 🔧 If Something Goes Wrong

**Problem**: Still getting 404 errors
**Solution**: Make sure you renamed `backend-php` to `api` in cPanel

**Problem**: Import doesn't work  
**Solution**: Check folder permissions are 755

**Problem**: Admin login fails
**Solution**: Make sure you visited the import URL first to create the database

The PHP backend is designed to work on ANY cPanel hosting provider with zero configuration!