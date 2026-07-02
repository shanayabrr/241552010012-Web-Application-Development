const express = require('express');
const prisma = require('../db');
const router = express.Router();

// GET all products
router.get('/', async (req, res, next) => {
  try {
    const data = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

// GET product by id
router.get('/:id', async (req, res, next) => {
  try {
    const p = await prisma.product.findUnique({
      where: { id: +req.params.id }
    });
    if (!p) return res.status(404).json({ error: 'Tidak ada' });
    res.json(p);
  } catch (e) {
    next(e);
  }
});

// POST create product
router.post('/', async (req, res, next) => {
  try {
    const { nama, harga, stok } = req.body;
    if (!nama || harga == null) {
      return res.status(400).json({ error: 'nama & harga wajib' });
    }
    const p = await prisma.product.create({
      data: { 
        nama, 
        harga: +harga, 
        stok: +(stok || 0) 
      }
    });
    res.status(201).json(p);
  } catch (e) {
    next(e);
  }
});

// PUT update product
router.put('/:id', async (req, res, next) => {
  try {
    const { nama, harga, stok } = req.body;
    const p = await prisma.product.update({
      where: { id: +req.params.id },
      data: { 
        nama, 
        harga: +harga, 
        stok: +stok 
      }
    });
    res.json(p);
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Tidak ada' });
    }
    next(e);
  }
});

// DELETE product
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.product.delete({ 
      where: { id: +req.params.id } 
    });
    res.status(204).send();
  } catch (e) {
    if (e.code === 'P2025') {
      return res.status(404).json({ error: 'Tidak ada' });
    }
    next(e);
  }
});

module.exports = router;