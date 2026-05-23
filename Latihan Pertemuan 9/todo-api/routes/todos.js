const router = require('express').Router();
let todos = []; let nextId = 1;

router.get('/', (req, res) => res.json(todos));

router.get('/:id', (req, res) => {
  const todo = todos.find(t => t.id == req.params.id);
  todo ? res.json(todo) : res.status(404).json({error:'Not found'});
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({error:'title required'});
  const todo = { id:nextId++, title, done:false,
                  createdAt: new Date().toISOString() };
  todos.push(todo); res.status(201).json(todo);
});

router.put('/:id', (req, res) => {
const todo = todos.find(t => t.id == req.params.id);
if (!todo) return res.status(404).json({error:'Not found'});
Object.assign(todo, req.body); res.json(todo);
});

router.delete('/:id', (req, res) => {
todos = todos.filter(t => t.id != req.params.id);
res.status(204).send();
});

module.exports = router;