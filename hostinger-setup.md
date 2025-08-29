# College Finder App - Hostinger Deployment Guide

## Quick Setup for Hostinger Shared Hosting

### Step 1: Upload Files
1. Extract `college-filter-app-hostinger.zip` 
2. Upload all files to your Hostinger public_html directory
3. Ensure correct file permissions (755 for directories, 644 for files)

### Step 2: Database Setup
1. Create PostgreSQL database in Hostinger control panel
2. Copy `.env.example` to `.env`
3. Update database credentials in `.env` file

### Step 3: Install Dependencies
In your Hostinger terminal or SSH:
```bash
npm install --production
```

### Step 4: Initialize Database
```bash
npm run db:push
```

### Step 5: Start Application
```bash
npm start
```

### Step 6: Configure Domain
Set up your domain to point to the Node.js application through Hostinger's control panel.

## Admin Access
- URL: https://yourdomain.com/admin
- Username: admin
- Password: admin123

## Support
Check console logs if you encounter issues. Ensure all environment variables are properly configured.

## Features
- Student portal with NEET score filtering
- Admin dashboard with analytics
- 16 real medical colleges data
- WhatsApp integration
- CSV export functionality
- Responsive design