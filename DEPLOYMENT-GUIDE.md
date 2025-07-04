# 🚀 KCING Store - Panduan Deploy ke cPanel

**Domain:** teskcinghitam.rusdiafandi.my.id  
**Tanggal:** 2 Juli 2025  
**Node.js Version:** 18.x (Compatible)

---

## 📋 DAFTAR ISI
1. [Persiapan Lokal](#persiapan-lokal)
2. [Konfigurasi cPanel](#konfigurasi-cpanel)
3. [Upload File](#upload-file)
4. [Setup Node.js Application](#setup-nodejs-application)
5. [Environment Variables](#environment-variables)
6. [Install Dependencies](#install-dependencies)
7. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 1. 📦 PERSIAPAN LOKAL

### Build Aplikasi React
```bash
cd "e:\doli\kcing.store"
npm run build
```

### Pastikan File Startup
**File startup utama:** `backend/server.js`

### File yang Perlu Diupload
```
✅ package.json (sudah fix compatibility)
✅ backend/ (folder lengkap)
✅ build/ (hasil npm run build)
✅ .env (environment variables)
❌ node_modules (JANGAN upload - akan auto-generate)
❌ src/ (tidak perlu untuk production)
```

---

## 2. ⚙️ KONFIGURASI CPANEL

### Node.js Requirements
- **Minimum:** Node.js 16.x
- **Recommended:** Node.js 18.x atau 20.x
- **Current Compatible:** ✅ Node.js 18.20.7

### Login ke cPanel
1. Buka browser → Login ke cPanel hosting
2. Cari menu **"Node.js Selector"**
3. Klik **"Create Application"**

---

## 3. 📁 UPLOAD FILE

### Target Directory
```
/home/rusdiafa/teskcinghitam.rusdiafandi.my.id/
```

### Cara Upload
1. **File Manager** di cPanel
2. Navigate ke folder domain
3. Upload file ZIP (kecuali node_modules)
4. Extract di folder tujuan

### Struktur File di Server
```
/home/rusdiafa/teskcinghitam.rusdiafandi.my.id/
├── package.json
├── .env
├── backend/
│   ├── server.js          ← Startup file
│   ├── database.js
│   ├── kcing_store.db
│   ├── package.json
│   └── uploads/
└── build/
    ├── index.html
    ├── static/
    └── ...
```

---

## 4. 🚀 SETUP NODE.JS APPLICATION

### Konfigurasi Node.js Selector
```
Node.js Version: 18.x (atau 20.x jika tersedia)
Application Mode: Production
Application Root: /home/rusdiafa/teskcinghitam.rusdiafandi.my.id
Application URL: teskcinghitam.rusdiafandi.my.id
Application Startup File: backend/server.js
```

### Klik "Create Application"

---

## 5. 🔐 ENVIRONMENT VARIABLES

### Di Node.js Selector, tambahkan:

**Variable 1:**
- Name: `NODE_ENV`
- Value: `production`

**Variable 2:**
- Name: `JWT_SECRET`
- Value: `kcing-store-jwt-secret-teskcinghitam-2025-secure-key`

**Variable 3:**
- Name: `PORT`
- Value: `3000`

**Variable 4:**
- Name: `ALLOWED_ORIGINS`
- Value: `https://teskcinghitam.rusdiafandi.my.id`

---

## 6. 💻 INSTALL DEPENDENCIES

### Buka Terminal di cPanel
```bash
cd /home/rusdiafa/teskcinghitam.rusdiafandi.my.id
```

### Install Production Dependencies
```bash
npm install --production
```

### Set File Permissions
```bash
chmod 644 backend/kcing_store.db
chmod 755 backend/uploads
chmod 755 backend
```

### Verify Installation
```bash
ls -la node_modules
# Harus muncul symlink ke virtual environment
```

---

## 7. ✅ TESTING & TROUBLESHOOTING

### Start Application
1. Kembali ke **Node.js Selector**
2. Klik tombol **"Start"** atau **"Restart"**
3. Status harus: **"Running"**

### Test URLs
- **Homepage:** https://teskcinghitam.rusdiafandi.my.id
- **API Test:** https://teskcinghitam.rusdiafandi.my.id/api/products
- **Admin Panel:** https://teskcinghitam.rusdiafandi.my.id/admin

### Check Logs (jika error)
```bash
# Di cPanel Terminal
cd /home/rusdiafa/teskcinghitam.rusdiafandi.my.id
node backend/server.js
# Lihat error message
```

---

## 🆘 TROUBLESHOOTING COMMON ISSUES

### 1. Application tidak start
**Solusi:**
```bash
# Check syntax
node -c backend/server.js

# Manual start untuk debug
cd /home/rusdiafa/teskcinghitam.rusdiafandi.my.id
node backend/server.js
```

### 2. Database Error
**Solusi:**
```bash
# Check database file
ls -la backend/kcing_store.db

# Reset permissions
chmod 644 backend/kcing_store.db
```

### 3. Upload Folder Error
**Solusi:**
```bash
# Create uploads folder
mkdir -p backend/uploads
chmod 755 backend/uploads
```

### 4. Module Not Found
**Solusi:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install --production
```

### 5. CORS Error
**Pastikan environment variables sudah benar:**
- `ALLOWED_ORIGINS=https://teskcinghitam.rusdiafandi.my.id`

---

## 📞 SUPPORT & MAINTENANCE

### Regular Backup
```bash
# Backup database
cp backend/kcing_store.db backup/kcing_store_$(date +%Y%m%d).db
```

### Update Application
1. Upload file baru
2. `npm install --production`
3. Restart application di Node.js Selector

### Monitor Application
- Check application status di Node.js Selector
- Monitor error logs di cPanel

---

## ✨ DEPLOYMENT CHECKLIST

**Pre-Deploy:**
- [ ] `npm run build` berhasil
- [ ] File .env sudah dikonfigurasi
- [ ] Dependencies compatible (react-router-dom v6.26.2)

**Deploy Process:**
- [ ] File uploaded ke cPanel
- [ ] Node.js Application created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Permissions set

**Post-Deploy:**
- [ ] Application status: Running
- [ ] Homepage accessible
- [ ] API endpoints working
- [ ] Admin panel functional

---

## 🎉 SELAMAT!

Jika semua checklist ✅, aplikasi **KCING Store** Anda sudah live di:
**https://teskcinghitam.rusdiafandi.my.id**

---
*Panduan ini dibuat khusus untuk domain teskcinghitam.rusdiafandi.my.id dengan CloudLinux Node.js Selector*
