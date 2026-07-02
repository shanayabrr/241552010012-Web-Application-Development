const API = 'http://localhost:3000/api';
async function apiFetch(path, opts={}) {
const res = await fetch(API+path, { headers:
{'Content-Type':'application/json'}, ...opts });
if (res.status===204) return null;
const data = await res.json();
if (!res.ok) throw new Error(data.message);
return data;
}

async function loadTodos() {
const list = document.querySelector('#list');
list.innerHTML = '<li class="loading">Memuat...</li>';
try {
const todos = await apiFetch('/todos');
if (!todos.length)
return list.innerHTML = '<li>Belum ada todo!</li>';
list.innerHTML = todos.map(t=>`
<li class="${t.done?'done':''}">
<label><input type="checkbox"
${t.done?'checked':''} onchange=
"toggleTodo(${t.id},this.checked)">
<span>${t.text}</span></label>
<button onclick="deleteTodo(${t.id})">Hapus</button>
</li>`).join('');
} catch(e) { list.innerHTML = `<li>Gagal: ${e.message}</li>`; }
}
async function addTodo() {
const inp=document.querySelector('#inp');
const text=inp.value.trim();
if (!text) return;
await apiFetch('/todos', { method:'POST',
body:JSON.stringify({text}) });
inp.value=''; loadTodos();
}
async function toggleTodo(id,done) {
await apiFetch(`/todos/${id}`,{ method:'PATCH',
body:JSON.stringify({done}) }); loadTodos();
}
async function deleteTodo(id) {
if (!confirm('Hapus?')) return;
await apiFetch(`/todos/${id}`,{ method:'DELETE' }); loadTodos();
}
document.addEventListener('DOMContentLoaded', loadTodos);
