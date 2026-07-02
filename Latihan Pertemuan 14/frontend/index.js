<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Todo App</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
<h1>Todo App</h1>
<div class="add-form">
<input type="text" id="inp"
placeholder="Tulis todo baru..."
onkeydown="if(event.key==='Enter') addTodo()">
<button onclick="addTodo()">Tambah</button>
</div>
<ul id="list"></ul>
</div>
<script src="app.js"></script>
</body>
</html>
