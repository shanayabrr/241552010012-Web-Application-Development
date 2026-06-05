let todos = [];

document.querySelector('#add').addEventListener('click', addTodo);

document.querySelector('#inp').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

function addTodo() {
  const text = document.querySelector('#inp').value.trim();

  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    done: false
  });

  document.querySelector('#inp').value = '';

  render();
}

// Event delegation untuk toggle & delete
document.querySelector('#list').addEventListener('click', e => {
  const id = +e.target.closest('li')?.dataset.id;

  if (e.target.matches('.btn-done')) {
    todos = todos.map(t =>
      t.id === id
        ? { ...t, done: !t.done }
        : t
    );
  }

  if (e.target.matches('.btn-del')) {
    todos = todos.filter(t => t.id !== id);
  }

  render();
});

function render() {
  document.querySelector('#list').innerHTML =
    todos.map(t => `
      <li data-id="${t.id}" class="${t.done ? 'done' : ''}">
        <span>${t.text}</span>
        <button class="btn-done">✓</button>
        <button class="btn-del">✕</button>
      </li>
    `).join('');

  const left = todos.filter(t => !t.done).length;

  document.querySelector('#count').textContent =
    left + ' todo tersisa';
}