# Soal Latihan UAS — Aplikasi Catatan Keuangan API

## Informasi Umum

| Item | Keterangan |
|------|------------|
| Topik | REST API dengan Express.js + Prisma ORM |
| Tipe Soal | Essay / Praktik |
| Waktu Pengerjaan | 120 menit |
| Sifat | Open book, dilarang mencontek pekerjaan teman |

---

## Latar Belakang

Sebuah startup ingin membangun aplikasi **Catatan Keuangan Pribadi** berbasis web. Anda ditugaskan untuk membangun backend API-nya. Aplikasi ini memungkinkan pengguna mencatat setiap transaksi keuangan mereka (pemasukan dan pengeluaran), serta melihat ringkasan kondisi keuangan mereka.

---

## Ketentuan Teknis

- Framework: **Express.js**
- Database: **SQLite** menggunakan **Prisma ORM**
- Autentikasi: **JWT (JSON Web Token)**
- Hash password: **bcryptjs**
- File `.env`, `package.json`, `db.js`, `index.js`, dan `prisma/schema.prisma` sudah disediakan sebagai starter 
- Jalankan `npx prisma migrate dev --name init` setelah schema siap

---

## Struktur File yang Harus Dibuat

Mahasiswa wajib membuat file-file berikut:

```
latihan-uas-NIM-NAMA/
├── middleware/
│   ├── authGuard.js     ← middleware cek JWT token
│   └── adminOnly.js     ← middleware cek role admin
└── routes/
    ├── auth.js          ← endpoint register & login
    └── transaksi.js     ← endpoint CRUD transaksi
```

---

## Soal Essay

### Soal 1 — Middleware Autentikasi (20 poin)

Buat file `middleware/authGuard.js`.

Middleware ini bertugas memverifikasi JWT token yang dikirimkan melalui header `Authorization: Bearer <token>`. Jika token valid, simpan data user ke `req.user` agar bisa digunakan di route selanjutnya. Jika token tidak ada atau tidak valid, kembalikan response error yang sesuai.

**Petunjuk:**
- Ambil header `Authorization` dari request
- Pastikan formatnya adalah `Bearer <token>`
- Verifikasi token menggunakan `jwt.verify()` dengan `JWT_SECRET` dari `.env`
- Jika valid, attach decoded data ke `req.user` lalu panggil `next()`
- Jika tidak valid atau tidak ada token, kembalikan HTTP `401`

---

### Soal 2 — Middleware Admin (10 poin)

Buat file `middleware/adminOnly.js`.

Middleware ini bertugas memastikan bahwa hanya user dengan `role === 'admin'` yang bisa mengakses endpoint tertentu. Middleware ini harus dipasang **setelah** `authGuard`.

---

### Soal 3 — Route Autentikasi (25 poin)

Buat file `routes/auth.js` dengan dua endpoint berikut:

**a) Register** — `POST /api/auth/register`
- Validasi: `email`, `nama`, dan `password` wajib diisi
- Validasi: `password` minimal 8 karakter
- Cek apakah email sudah terdaftar
- Hash password menggunakan `bcryptjs` sebelum disimpan
- Simpan user baru ke database dengan `role` default `"user"`
- Kembalikan data user (tanpa field `password`)

**b) Login** — `POST /api/auth/login`
- Validasi: `email` dan `password` wajib diisi
- Cari user berdasarkan email
- Bandingkan password menggunakan `bcrypt.compare()`
- Jika berhasil, buat JWT token dengan masa berlaku 7 hari
- Token harus menyimpan: `userId`, `email`, `nama`, `role`
- Kembalikan token beserta data user (tanpa `password`)

---

### Soal 4 — Route Transaksi (45 poin)

Buat file `routes/transaksi.js`. Semua endpoint di bawah ini memerlukan autentikasi (sudah dipasang `authGuard` di `index.js`).

> **Aturan akses penting:**
> - **User biasa** hanya bisa melihat, mengubah, dan menghapus transaksi **milik sendiri**
> - **Admin** bisa melihat, mengubah, dan menghapus **semua** transaksi

**a) Tambah transaksi** — `POST /api/transaksi` *(10 poin)*
- Validasi field wajib: `judul`, `jumlah`, `jenis`, `kategori`
- Validasi `jenis` hanya boleh bernilai `"pemasukan"` atau `"pengeluaran"`
- Validasi `jumlah` harus berupa angka positif
- Field `tanggal` bersifat opsional (jika tidak dikirim, gunakan waktu sekarang)
- Simpan transaksi dikaitkan dengan user yang sedang login (`req.user.userId`)

**b) Lihat semua transaksi** — `GET /api/transaksi` *(5 poin)*
- User biasa hanya mendapat transaksinya sendiri
- Admin mendapat semua transaksi dari semua user
- Urutkan dari tanggal terbaru ke terlama
- Sertakan data user (id, nama, email) di setiap item transaksi

**c) Lihat detail transaksi** — `GET /api/transaksi/:id` *(5 poin)*
- Jika transaksi tidak ditemukan, kembalikan `404`
- Jika transaksi bukan milik user dan user bukan admin, kembalikan `403`

**d) Update transaksi** — `PUT /api/transaksi/:id` *(10 poin)*
- Jika transaksi tidak ditemukan, kembalikan `404`
- Jika transaksi bukan milik user dan user bukan admin, kembalikan `403`
- Semua field bersifat opsional (partial update)
- Validasi `jenis` dan `jumlah` jika dikirimkan

**e) Hapus transaksi** — `DELETE /api/transaksi/:id` *(5 poin)*
- Jika transaksi tidak ditemukan, kembalikan `404`
- Jika transaksi bukan milik user dan user bukan admin, kembalikan `403`
- User biasa **boleh menghapus** transaksinya sendiri (berbeda dari produk-api)

**f) Ringkasan keuangan** — `GET /api/transaksi/ringkasan` *(10 poin)*
- Hitung total pemasukan, total pengeluaran, dan saldo
- User biasa hanya dihitung dari transaksinya sendiri
- Admin dihitung dari seluruh transaksi

> **Perhatian:** Definisikan endpoint `/ringkasan` **sebelum** `/:id` agar tidak tertukar!

---

## Kontrak API

### Base URL
```
http://localhost:3000
```

### Autentikasi
Endpoint yang membutuhkan login harus menyertakan header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "budi@email.com",
  "nama": "Budi Santoso",
  "password": "rahasia123"
}
```

**Response `201 Created`:**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "email": "budi@email.com",
    "nama": "Budi Santoso",
    "role": "user",
    "createdAt": "2026-07-02T08:00:00.000Z",
    "updatedAt": "2026-07-02T08:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `400`  | Field wajib kosong atau password < 8 karakter |
| `409`  | Email sudah terdaftar |

---

#### `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "budi@email.com",
  "password": "rahasia123"
}
```

**Response `200 OK`:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "budi@email.com",
    "nama": "Budi Santoso",
    "role": "user",
    "createdAt": "2026-07-02T08:00:00.000Z",
    "updatedAt": "2026-07-02T08:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `400`  | Field wajib kosong |
| `401`  | Email atau password salah |

---

### Transaksi Endpoints

> Semua endpoint transaksi membutuhkan header `Authorization: Bearer <token>`

---

#### `POST /api/transaksi`

**Request Body:**
```json
{
  "judul": "Gaji Bulanan",
  "jumlah": 5000000,
  "jenis": "pemasukan",
  "kategori": "Gaji",
  "tanggal": "2026-07-01T00:00:00.000Z"
}
```
> `tanggal` bersifat **opsional**. `jenis` hanya boleh `"pemasukan"` atau `"pengeluaran"`.

**Response `201 Created`:**
```json
{
  "message": "Transaksi berhasil ditambahkan",
  "transaksi": {
    "id": 1,
    "judul": "Gaji Bulanan",
    "jumlah": 5000000,
    "jenis": "pemasukan",
    "kategori": "Gaji",
    "tanggal": "2026-07-01T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2026-07-02T08:00:00.000Z",
    "updatedAt": "2026-07-02T08:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `400`  | Field wajib kosong, `jenis` tidak valid, atau `jumlah` bukan angka positif |
| `401`  | Token tidak ada atau tidak valid |

---

#### `GET /api/transaksi`

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "judul": "Gaji Bulanan",
    "jumlah": 5000000,
    "jenis": "pemasukan",
    "kategori": "Gaji",
    "tanggal": "2026-07-01T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2026-07-02T08:00:00.000Z",
    "updatedAt": "2026-07-02T08:00:00.000Z",
    "user": {
      "id": 1,
      "nama": "Budi Santoso",
      "email": "budi@email.com"
    }
  }
]
```
> User biasa hanya melihat transaksinya sendiri. Admin melihat semua.

---

#### `GET /api/transaksi/ringkasan`

**Response `200 OK`:**
```json
{
  "totalPemasukan": 5000000,
  "totalPengeluaran": 1500000,
  "saldo": 3500000
}
```
> User biasa hanya dihitung dari transaksi miliknya. Admin dihitung dari semua transaksi.

---

#### `GET /api/transaksi/:id`

**Response `200 OK`:**
```json
{
  "id": 1,
  "judul": "Gaji Bulanan",
  "jumlah": 5000000,
  "jenis": "pemasukan",
  "kategori": "Gaji",
  "tanggal": "2026-07-01T00:00:00.000Z",
  "userId": 1,
  "createdAt": "2026-07-02T08:00:00.000Z",
  "updatedAt": "2026-07-02T08:00:00.000Z",
  "user": {
    "id": 1,
    "nama": "Budi Santoso",
    "email": "budi@email.com"
  }
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `403`  | Transaksi bukan milik user dan bukan admin |
| `404`  | Transaksi tidak ditemukan |

---

#### `PUT /api/transaksi/:id`

**Request Body** (semua field opsional):
```json
{
  "judul": "Gaji Bulanan Juli",
  "jumlah": 5500000,
  "jenis": "pemasukan",
  "kategori": "Gaji",
  "tanggal": "2026-07-02T00:00:00.000Z"
}
```

**Response `200 OK`:**
```json
{
  "message": "Transaksi berhasil diupdate",
  "transaksi": {
    "id": 1,
    "judul": "Gaji Bulanan Juli",
    "jumlah": 5500000,
    "jenis": "pemasukan",
    "kategori": "Gaji",
    "tanggal": "2026-07-02T00:00:00.000Z",
    "userId": 1,
    "createdAt": "2026-07-02T08:00:00.000Z",
    "updatedAt": "2026-07-02T09:00:00.000Z"
  }
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `400`  | `jenis` tidak valid atau `jumlah` bukan angka positif |
| `403`  | Transaksi bukan milik user dan bukan admin |
| `404`  | Transaksi tidak ditemukan |

---

#### `DELETE /api/transaksi/:id`

**Response `200 OK`:**
```json
{
  "message": "Transaksi berhasil dihapus"
}
```

**Response Error:**

| Status | Kondisi |
|--------|---------|
| `403`  | Transaksi bukan milik user dan bukan admin |
| `404`  | Transaksi tidak ditemukan |

---

## Database Schema (sudah disediakan)

```prisma
model User {
  id        Int         @id @default(autoincrement())
  email     String      @unique
  nama      String
  password  String
  role      String      @default("user")
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  transaksi Transaksi[]
}

model Transaksi {
  id        Int      @id @default(autoincrement())
  judul     String
  jumlah    Float
  jenis     String
  kategori  String
  tanggal   DateTime @default(now())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## Cara Setup & Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan migrasi database
npx prisma migrate dev --name init

# 3. Generate Prisma Client
npx prisma generate

# 4. Jalankan server
npm run dev
```

---

## Kriteria Penilaian

| No | Komponen | Poin |
|----|----------|------|
| 1  | Middleware `authGuard.js` berfungsi dengan benar | 20 |
| 2  | Middleware `adminOnly.js` berfungsi dengan benar | 10 |
| 3  | Endpoint register & login | 25 |
| 4a | `POST /api/transaksi` | 10 |
| 4b | `GET /api/transaksi` | 5 |
| 4c | `GET /api/transaksi/:id` | 5 |
| 4d | `PUT /api/transaksi/:id` | 10 |
| 4e | `DELETE /api/transaksi/:id` | 5 |
| 4f | `GET /api/transaksi/ringkasan` | 10 |
| **Total** | | **100** |

---

*Selamat mengerjakan! Pastikan server dapat berjalan tanpa error sebelum dikumpulkan.*
