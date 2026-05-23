const express = require('express');
const todos =
require('./routes/todos');
const app = express();
app.use(express.json());
app.use('/todos', todos);
app.listen(3000, () =>
  console.log('Todo API: port 3000')
);