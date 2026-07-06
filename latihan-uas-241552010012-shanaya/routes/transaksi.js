const express = require('express');
const router = express.Router();
const prisma = require('../db');

// ==========================================
// 1. GET /ringkasan (HARUS DI ATAS /:id)
// ==========================================
router.get('/ringkasan', async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const whereClause = isAdmin ? {} : { userId: req.user.userId };

        const transaksiList = await prisma.transaksi.findMany({
            where: whereClause
        });

        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        transaksiList.forEach((t) => {
            if (t.jenis === 'pemasukan') {
                totalPemasukan += t.jumlah;
            } else if (t.jenis === 'pengeluaran') {
                totalPengeluaran += t.jumlah;
            }
        });

        const saldo = totalPemasukan - totalPengeluaran;

        return res.status(200).json({
            totalPemasukan,
            totalPengeluaran,
            saldo
        });
    } catch (error) {
        console.error('Error saat get ringkasan:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 2. POST / (Tambah Transaksi)
// ==========================================
router.post('/', async (req, res) => {
    try {
        const { judul, jumlah, jenis, kategori, tanggal } = req.body;

        if (!judul || jumlah === undefined || !jenis || !kategori) {
            return res.status(400).json({ message: 'Judul, jumlah, jenis, dan kategori wajib diisi' });
        }

        if (jenis !== 'pemasukan' && jenis !== 'pengeluaran') {
            return res.status(400).json({ message: 'Jenis transaksi harus berupa "pemasukan" atau "pengeluaran"' });
        }

        if (typeof jumlah !== 'number' || jumlah <= 0) {
            return res.status(400).json({ message: 'Jumlah transaksi harus berupa angka positif' });
        }

        const dataTransaksi = {
            judul,
            jumlah,
            jenis,
            kategori,
            userId: req.user.userId 
        };

        if (tanggal) {
            dataTransaksi.tanggal = new Date(tanggal);
        }

        const transaksiBaru = await prisma.transaksi.create({
            data: dataTransaksi
        });

        return res.status(201).json({
            message: 'Transaksi berhasil ditambahkan',
            transaksi: transaksiBaru
        });
    } catch (error) {
        console.error('Error saat tambah transaksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 3. GET / (Lihat Semua Transaksi)
// ==========================================
router.get('/', async (req, res) => {
    try {
        const isAdmin = req.user.role === 'admin';
        const whereClause = isAdmin ? {} : { userId: req.user.userId };

        const transaksiList = await prisma.transaksi.findMany({
            where: whereClause,
            orderBy: {
                tanggal: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nama: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json(transaksiList);
    } catch (error) {
        console.error('Error saat get all transaksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 4. GET /:id (Detail Transaksi)
// ==========================================
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const transaksi = await prisma.transaksi.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        nama: true,
                        email: true
                    }
                }
            }
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        if (transaksi.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        return res.status(200).json(transaksi);
    } catch (error) {
        console.error('Error saat get detail transaksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 5. PUT /:id (Update Transaksi)
// ==========================================
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const transaksi = await prisma.transaksi.findUnique({
            where: { id }
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        if (transaksi.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        const { judul, jumlah, jenis, kategori, tanggal } = req.body;

        if (jenis !== undefined && jenis !== 'pemasukan' && jenis !== 'pengeluaran') {
            return res.status(400).json({ message: 'Jenis transaksi harus berupa "pemasukan" atau "pengeluaran"' });
        }
        
        if (jumlah !== undefined && (typeof jumlah !== 'number' || jumlah <= 0)) {
            return res.status(400).json({ message: 'Jumlah transaksi harus berupa angka positif' });
        }

        const dataUpdate = {};
        if (judul !== undefined) dataUpdate.judul = judul;
        if (jumlah !== undefined) dataUpdate.jumlah = jumlah;
        if (jenis !== undefined) dataUpdate.jenis = jenis;
        if (kategori !== undefined) dataUpdate.kategori = kategori;
        if (tanggal !== undefined) dataUpdate.tanggal = new Date(tanggal);

        const transaksiUpdate = await prisma.transaksi.update({
            where: { id },
            data: dataUpdate
        });

        return res.status(200).json({
            message: 'Transaksi berhasil diupdate',
            transaksi: transaksiUpdate
        });
    } catch (error) {
        console.error('Error saat update transaksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 6. DELETE /:id (Hapus Transaksi)
// ==========================================
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        const transaksi = await prisma.transaksi.findUnique({
            where: { id }
        });

        if (!transaksi) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan' });
        }

        if (transaksi.userId !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Akses ditolak' });
        }

        await prisma.transaksi.delete({
            where: { id }
        });

        return res.status(200).json({
            message: 'Transaksi berhasil dihapus'
        });
    } catch (error) {
        console.error('Error saat hapus transaksi:', error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;