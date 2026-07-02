const router = require('express').Router();
const prisma = require('../db');

router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) {
    return res.status(400).json({ message: 'Text kosong' });
  }
  try {
    const todo = await prisma.todo.create({ data: { text: text.trim() }
});
    res.status(201).json(todo);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: { done: req.body.done }
    });
    res.json(todo);
  } catch (_) {
    res.status(404).json({ message: 'Tidak ditemukan' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.todo.delete({ where: { id } });
    res.status(204).send();
  } catch (_) {
    res.status(404).json({ message: 'Tidak ditemukan' });
  }
});

module.exports = router;
