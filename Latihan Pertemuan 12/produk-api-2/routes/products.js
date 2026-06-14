// routes/products.js

const router = require('express').Router();
const validate = require('../middleware/validateProduct');

// Data simulasi database
let products = require('../data/seed');
let nextId = products.length + 1;

// ======================================================
// GET /api/products
// Support:
// ?kategori=buah
// ?search=apel
// ?minHarga=5000
// ?maxHarga=15000
// ?sort=harga
// ?sort=nama
// ======================================================
router.get('/', (req, res) => {
    let result = [...products];

    if (req.query.kategori) {
        result = result.filter(
            p => p.kategori === req.query.kategori
        );
    }

    if (req.query.search) {
        result = result.filter(
            p =>
                p.nama
                    .toLowerCase()
                    .includes(req.query.search.toLowerCase())
        );
    }

    if (req.query.minHarga) {
        result = result.filter(
            p => p.harga >= Number(req.query.minHarga)
        );
    }

    if (req.query.maxHarga) {
        result = result.filter(
            p => p.harga <= Number(req.query.maxHarga)
        );
    }

    if (req.query.sort === 'harga') {
        result.sort((a, b) => a.harga - b.harga);
    } else if (req.query.sort === 'nama') {
        result.sort((a, b) =>
            a.nama.localeCompare(b.nama)
        );
    }

    res.json({
        total: result.length,
        data: result
    });
});

// ======================================================
// GET /api/products/:id
// ======================================================
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return res.status(400).json({
            error: 'ID harus berupa angka'
        });
    }

    const product = products.find(
        p => p.id === id
    );

    if (!product) {
        return res.status(404).json({
            error: 'Produk tidak ditemukan'
        });
    }

    res.json(product);
});

// ======================================================
// POST /api/products
// ======================================================
router.post('/', validate, (req, res) => {
    const product = {
        id: nextId++,
        ...req.body,
        createdAt: new Date().toISOString()
    };

    products.push(product);

    res.status(201).json(product);
});

// ======================================================
// PUT /api/products/:id
// ======================================================
router.put('/:id', validate, (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(
        p => p.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Produk tidak ditemukan'
        });
    }

    products[index] = {
        ...products[index],
        ...req.body,
        id
    };

    res.json(products[index]);
});

// ======================================================
// PATCH /api/products/:id
// ======================================================
router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = products.findIndex(
        p => p.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            error: 'Produk tidak ditemukan'
        });
    }

    Object.assign(products[index], req.body);

    res.json(products[index]);
});

// ======================================================
// DELETE /api/products/:id
// ======================================================
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    const before = products.length;

    products = products.filter(
        p => p.id !== id
    );

    if (products.length === before) {
        return res.status(404).json({
            error: 'Produk tidak ditemukan'
        });
    }

    res.status(204).send();
});

module.exports = router;