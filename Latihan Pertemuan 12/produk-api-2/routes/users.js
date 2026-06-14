const router = require('express').Router();

let users = [
    {
        id: 1,
        nama: 'Agus',
        email: 'agus@tazkia.ac.id',
        role: 'admin'
    },
    {
        id: 2,
        nama: 'Budi',
        email: 'budi@tazkia.ac.id',
        role: 'user'
    },
    {
        id: 3,
        nama: 'Citra',
        email: 'citra@tazkia.ac.id',
        role: 'user'
    }
];

let nextId = users.length + 1;

router.get('/', (req, res) => {
    res.json({
        total: users.length,
        data: users
    });
});

router.get('/:id', (req, res) => {
    const user = users.find(
        u => u.id === Number(req.params.id)
    );

    if (!user) {
        return res.status(404).json({
            error: 'User tidak ditemukan'
        });
    }

    res.json(user);
});

router.post('/', (req, res) => {
    const { nama, email, role = 'user' } = req.body;

    const errors = [];

    if (!nama || nama.trim().length < 2) {
        errors.push('nama minimal 2 karakter');
    }

    if (!email || !email.includes('@')) {
        errors.push('email tidak valid');
    }

    if (!['admin', 'user'].includes(role)) {
        errors.push('role harus admin atau user');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            errors
        });
    }

    const user = {
        id: nextId++,
        nama: nama.trim(),
        email,
        role
    };

    users.push(user);

    res.status(201).json(user);
});

router.put('/:id', (req, res) => {
    const idx = users.findIndex(
        u => u.id === Number(req.params.id)
    );

    if (idx === -1) {
        return res.status(404).json({
            error: 'User tidak ditemukan'
        });
    }

    users[idx] = {
        ...users[idx],
        ...req.body,
        id: Number(req.params.id)
    };

    res.json(users[idx]);
});

router.delete('/:id', (req, res) => {
    const before = users.length;

    users = users.filter(
        u => u.id !== Number(req.params.id)
    );

    if (users.length === before) {
        return res.status(404).json({
            error: 'User tidak ditemukan'
        });
    }

    res.status(204).send();
});

module.exports = router;