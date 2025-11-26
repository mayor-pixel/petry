const inputEl = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksListEl = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter');

let tasks = []; // { id, text, completed }
let filter = 'all';

// Load from localStorage
function loadTasks() {
  const data = localStorage.getItem('tasksApp_tasks');
  tasks = data ? JSON.parse(data) : [];
}
function saveTasks() {
  localStorage.setItem('tasksApp_tasks', JSON.stringify(tasks));
}

function renderTasks() {
  tasksListEl.innerHTML = '';
  let filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');
    li.dataset.id = task.id;
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;
    span.onclick = () => toggleCompleted(task.id);
    const delBtn = document.createElement('button');
    delBtn.className = 'deleteBtn';
    delBtn.textContent = '✖';
    delBtn.onclick = () => deleteTask(task.id);
    li.append(span, delBtn);
    tasksListEl.appendChild(li);
  });
}

function addTask(text) {
  const newTask = { id: Date.now(), text, completed: false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

function toggleCompleted(id) {
  tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

addTaskBtn.addEventListener('click', () => {
  const text = inputEl.value.trim();
  if (!text) return alert('Please enter a task');
  addTask(text);
  inputEl.value = '';
});

inputEl.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    addTaskBtn.click();
  }
});

filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filter = btn.dataset.filter;
  renderTasks();
}));

// initial run
loadTasks();
renderTasks();

