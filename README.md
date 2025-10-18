# Warehouse Management System (WMS) - Full Stack App

Aplikasi manajemen gudang sederhana berbasis **Laravel (API)** dan **React (Frontend)**.  
Fitur utama:
- Login & role-based access (Admin & Staff)
- CRUD Produk
- Transaksi barang masuk/keluar
- Dashboard pergerakan stok
- Sorting & searching di produk & transaksi

---

## 🚀 Instalasi & Jalankan Aplikasi

### Backend (Laravel)

1. Clone repository:
```bash
git clone https://github.com/HariyantoBermula/wms-app.git
cd wms-app

2. Install dependencies:

composer install

3.Buat file .env dari .env.example:
cp .env.example .env

4. Sesuaikan konfigurasi database di .env:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wms_db
DB_USERNAME=root
DB_PASSWORD=

5. Migrasi database & seed data contoh:
php artisan migrate:fresh --seed

6. Jalankan server backend:
php artisan serve

Frontend (React)

1. Masuk ke folder frontend (jika dipisah):
cd frontend

2. Install dependencies:

npm install

3. Jalankan development server:
npm start
Frontend akan tersedia di: http://localhost:3000

| Role  | Email                                   | Password    |
| ----- | --------------------------------------- | ----------- |
| Admin | [admin@mail.com](mailto:admin@mail.com) | password123 |
| Staff | [staff@mail.com](mailto:staff@mail.com) | password123 |

📦 Contoh Data
Sudah disertakan seed data di Laravel (UserSeeder, ProductSeeder, TransactionSeeder).
Jika ingin export SQL, bisa gunakan:
mysqldump -u root -p wms_db > wms_db_dump.sql

📌 Catatan

Pastikan backend & frontend berjalan bersamaan agar API bisa diakses.
Role Admin bisa mengakses semua fitur, Staff hanya transaksi.
Gunakan token API untuk testing Postman jika perlu.
