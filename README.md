# KCING.STORE

Aplikasi full-stack untuk toko online KCING.HITAM dengan sistem pembayaran QRIS & e-wallet, dashboard admin, dan manajemen voucher.

## 🚀 Fitur Lengkap

### Untuk Customer
- Registrasi & Login user (WAJIB login setiap akses aplikasi)
- Checkout produk dengan QRIS, ShopeePay, DANA, GoPay, SeaBank, BSI
- Sistem voucher diskon
- Upload bukti pembayaran
- Riwayat transaksi
- Edit profil & upload avatar
- Integrasi WhatsApp untuk konfirmasi pembayaran

### Untuk Admin
- Dashboard admin lengkap
- Manajemen user (lihat, suspend, hapus)
- Manajemen transaksi (approve, reject, delete, update status)
- Manajemen voucher (CRUD, aktivasi, nonaktifkan)
- Manajemen produk (edit, aktif/nonaktif)
- Lihat & verifikasi bukti pembayaran
- Download laporan transaksi & extension
- Statistik penjualan, voucher, extension

### Sistem Pembayaran
- QRIS All Payment (semua bank & e-wallet, tanpa biaya tambahan)
- ShopeePay, DANA, GoPay, SeaBank, BSI (nomor & nama rekening jelas)
- Upload bukti transfer wajib
- Semua pembayaran diverifikasi admin

### Keamanan & Kenyamanan
- JWT authentication (backend)
- Password terenkripsi (bcryptjs)
- Session management aman
- Semua akses dashboard/admin wajib login
- Tidak ada auto-login/cached session: setiap buka aplikasi WAJIB login ulang

## 🛠️ Cara Menjalankan

### 1. Jalankan Backend
```bash
cd backend
npm install
npm start
```
Server backend: http://localhost:5000

### 2. Jalankan Frontend
```bash
npm install
npm start
```
Aplikasi frontend: http://localhost:3000

### 3. Login
- **WAJIB login setiap akses aplikasi** (user/admin)
- Akun admin default:
  - Username: `admin`
  - Email: `admin@kcing.store`
  - Password: `admin123`

## 📦 Teknologi
- React 18 + TypeScript
- Styled-components
- React Router
- Axios
- Node.js + Express
- SQLite
- JWT Auth
- Multer (upload file)

## 📝 Catatan Penting
- Backend HARUS dijalankan sebelum frontend
- Semua user/admin WAJIB login setiap akses aplikasi (tidak ada auto-login/cached session)
- File upload tersimpan di `backend/uploads/`
- Database otomatis dibuat di `backend/database.db`
- QRIS & e-wallet: pembayaran diverifikasi manual oleh admin

---

Store: KCING.HITAM STORE, Estd. 2022  
Location: Rantauprapat, Sumatera Utara  
Contact: WhatsApp 082268913491  
Instagram: @kcing.hitam
