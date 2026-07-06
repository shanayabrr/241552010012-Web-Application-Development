// 1. Import module yang dibutuhkan
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

// --- a) Endpoint Register ---
// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        // Ambil data dari request body
        const { email, nama, password } = req.body;

        // Validasi keberadaan field
        if (!email || !nama || !password) {
            return res.status(400).json({ message: 'Semua field (email, nama, password) wajib diisi' });
        }

        // Validasi panjang password
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password minimal 8 karakter' });
        }

        // Cek apakah email sudah terdaftar di database
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar' });
        }

        // Hash password (async)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan user baru ke database
        const user = await prisma.user.create({
            data: {
                email,
                nama,
                password: hashedPassword
            }
        });

        // Destructuring untuk membuang field password dari response
        const { password: _, ...userWithoutPassword } = user;

        // Kembalikan response 201 Created
        return res.status(201).json({
            message: 'Registrasi berhasil',
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error saat register:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// --- b) Endpoint Login ---
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        // Ambil data dari request body
        const { email, password } = req.body;

        // Validasi keberadaan field
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password wajib diisi' });
        }

        // Cari user berdasarkan email
        const user = await prisma.user.findUnique({ where: { email } });
        
        // Jika user tidak ditemukan, kembalikan 401 (pesan umum demi keamanan)
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Bandingkan password yang dikirim dengan password yang di-hash di database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        // Jika password tidak cocok, kembalikan 401
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Jika berhasil, buat JWT token
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email, 
                nama: user.nama, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Masa berlaku 7 hari
        );

        // Destructuring untuk membuang field password dari response
        const { password: _, ...userWithoutPassword } = user;

        // Kembalikan response 200 OK beserta token
        return res.status(200).json({
            message: 'Login berhasil',
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Error saat login:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

module.exports = router;