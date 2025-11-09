import { renderApp, renderLoading, renderError } from "./ui.js";

const app = document.getElementById("app");
const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.querySelector(".form-check-label");
const btnRegistrar = document.getElementById("btnRegistrar");
const btnProductos = document.getElementById("btnProductos");

let nextId = 1;
let items = [];
let currentTab = "form";

// ===============================
// Render principal
// ===============================
async function loadAndRender() {
  renderLoading(app);
  await new Promise((res) => setTimeout(res, 200));

  renderApp(app, {
    items,
    onCreate: handleCreate,
    onDelete: handleDelete,
    onEdit: handleEdit,
    currentTab,
  });
}

// ===============================
// CRUD
// ===============================
function handleCreate(data) {
  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const newItem = {
    _id: nextId++,
    name: data.name.trim(),
    qty: Number(data.qty),
    price: Number(data.price),
    category: data.category || "Otros",
    date: formattedDate,
  };

  if (!newItem.name || isNaN(newItem.qty) || isNaN(newItem.price)) {
    renderError(app, "Por favor, completa todos los campos correctamente.");
    return;
  }

  items.push(newItem);
  currentTab = "list";
  loadAndRender();
}

function handleDelete(id) {
  const confirmDelete = confirm("¿Deseas eliminar este producto?");
  if (!confirmDelete) return;

  // Asegura comparación correcta de tipos
  items = items.filter((item) => item._id !== Number(id));

  // Re-renderiza lista actualizada
  loadAndRender();
}

function handleEdit(item) {
  const newName = prompt("Nuevo nombre:", item.name);
  if (newName === null) return;

  const newQty = Number(prompt("Nueva cantidad:", item.qty));
  const newPrice = Number(prompt("Nuevo precio:", item.price));

  if (!newName.trim() || isNaN(newQty) || isNaN(newPrice)) {
    renderError(app, "Cantidad o precio inválido");
    return;
  }

  items = items.map((it) =>
    it._id === item._id
      ? { ...it, name: newName.trim(), qty: newQty, price: newPrice }
      : it
  );

  loadAndRender();
}

// ===============================
// Tema
// ===============================
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  themeSwitch.checked = savedTheme === "light";
  updateThemeLabel(savedTheme);

  themeSwitch.addEventListener("change", () => {
    const newTheme = themeSwitch.checked ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeLabel(newTheme);
  });
}

function updateThemeLabel(theme) {
  themeLabel.textContent = theme === "light" ? "Modo Oscuro" : "Modo Claro";
}

// ===============================
// Tabs
// ===============================
btnRegistrar.addEventListener("click", () => {
  currentTab = "form";
  document
    .querySelectorAll(".nav-link")
    .forEach((btn) => btn.classList.remove("active"));
  btnRegistrar.classList.add("active");
  loadAndRender();
});

btnProductos.addEventListener("click", () => {
  currentTab = "list";
  document
    .querySelectorAll(".nav-link")
    .forEach((btn) => btn.classList.remove("active"));
  btnProductos.classList.add("active");
  loadAndRender();
});

// ===============================
// Init
// ===============================
initTheme();
loadAndRender();
