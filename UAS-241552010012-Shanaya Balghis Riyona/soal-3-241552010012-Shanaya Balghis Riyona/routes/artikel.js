const express = require('express');
const prisma = require('../db');
const authGuard = require('../middleware/authGuard');

const router = express.Router();

const VALID_STATUS = ['draft', 'published'];

// ============================================================
// POST /api/artikel — Perlu login
// ============================================================
router.post('/', authGuard, async (req, res) => {
  try {
    const { judul, isi, kategori, status } = req.body;

    if (!judul || !isi) {
      return res.status(400).json({ message: 'Judul dan isi wajib diisi' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid, harus "draft" atau "published"' });
    }

    const artikel = await prisma.artikel.create({
      data: {
        judul,
        isi,
        kategori: kategori ?? null,
        status: status || 'draft',
        userId: req.user.userId,
      },
    });

    return res.status(201).json({
      message: 'Artikel berhasil dibuat',
      artikel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ============================================================
// GET /api/artikel/publik — Tanpa login
// PENTING: didefinisikan sebelum /:id agar tidak tertangkap sebagai id
// ============================================================
router.get('/publik', async (req, res) => {
  try {
    const artikelList = await prisma.artikel.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, nama: true },
        },
      },
    });

    return res.status(200).json(artikelList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ============================================================
// GET /api/artikel/ringkasan — Perlu login
// PENTING: didefinisikan sebelum /:id agar tidak tertangkap sebagai id
// ============================================================
router.get('/ringkasan', authGuard, async (req, res) => {
  try {
    const baseWhere = req.user.role === 'admin' ? {} : { userId: req.user.userId };

    const [draftCount, publishedCount] = await Promise.all([
      prisma.artikel.count({ where: { ...baseWhere, status: 'draft' } }),
      prisma.artikel.count({ where: { ...baseWhere, status: 'published' } }),
    ]);

    return res.status(200).json({
      draft: draftCount,
      published: publishedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ============================================================
// GET /api/artikel — Perlu login (privat)
// ============================================================
router.get('/', authGuard, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.userId };

    const artikelList = await prisma.artikel.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, nama: true, email: true },
        },
      },
    });

    return res.status(200).json(artikelList);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ============================================================
// PUT /api/artikel/:id — Perlu login
// ============================================================
router.put('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const { judul, isi, kategori, status } = req.body;

    const artikel = await prisma.artikel.findUnique({ where: { id: Number(id) } });

    if (!artikel) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    if (artikel.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke artikel ini' });
    }

    if (status && !VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid, harus "draft" atau "published"' });
    }

    // Partial update — hanya field yang dikirim yang diubah
    const dataToUpdate = {};
    if (judul !== undefined) dataToUpdate.judul = judul;
    if (isi !== undefined) dataToUpdate.isi = isi;
    if (kategori !== undefined) dataToUpdate.kategori = kategori;
    if (status !== undefined) dataToUpdate.status = status;

    const updatedArtikel = await prisma.artikel.update({
      where: { id: Number(id) },
      data: dataToUpdate,
    });

    return res.status(200).json({
      message: 'Artikel berhasil diupdate',
      artikel: updatedArtikel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

// ============================================================
// DELETE /api/artikel/:id — Perlu login
// ============================================================
router.delete('/:id', authGuard, async (req, res) => {
  try {
    const { id } = req.params;

    const artikel = await prisma.artikel.findUnique({ where: { id: Number(id) } });

    if (!artikel) {
      return res.status(404).json({ message: 'Artikel tidak ditemukan' });
    }

    if (artikel.userId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Anda tidak memiliki akses ke artikel ini' });
    }

    await prisma.artikel.delete({ where: { id: Number(id) } });

    return res.status(200).json({ message: 'Artikel berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
