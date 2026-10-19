const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const count = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem("todo-list-tasks") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

let tasks = loadTasks();

function saveTasks() {
  localStorage.setItem("todo-list-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(task.completed);
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => {
      const updated = prompt("Edit task:", task.text);
      if (updated !== null && updated.trim()) {
        task.text = updated.trim().slice(0, 200);
        saveTasks();
        renderTasks();
      }
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Delete";
    remove.className = "delete-button";
    remove.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, text, edit, remove);
    list.appendChild(li);
  });

  const remaining = tasks.filter((task) => !task.completed).length;
  count.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
  emptyState.hidden = tasks.length > 0;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: text.slice(0, 200),
    completed: false
  });

  saveTasks();
  renderTasks();
  input.value = "";
  input.focus();
});

renderTasks();
