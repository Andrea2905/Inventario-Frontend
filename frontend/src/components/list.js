export function createTable(
  items,
  { onDelete, onEdit, currentPage, totalPages, onNextPage, onPrevPage }
) {
  const container = document.createElement("div");
  container.className = "table-container";

  // ===== FILTROS =====
  const filtersDiv = document.createElement("div");
  filtersDiv.className = "filters";

  filtersDiv.innerHTML = `
    <input type="text" class="form-control search-input" placeholder="🔍 Buscar por ID o nombre...">
    <select class="form-select filter-select" id="yearFilter"></select>
    <select class="form-select filter-select" id="monthFilter">
      <option value="">Mes</option>
      ${Array.from({ length: 12 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join("")}
    </select>
    <select class="form-select filter-select" id="categoryFilter">
      <option value="">Categoría</option>
      <option>Papelería</option>
      <option>Ropa y accesorios</option>
      <option>Belleza y cuidado personal</option>
      <option>Herramientas y ferretería</option>
      <option>Electrónicos y tecnología</option>
      <option>Hogar y cocina</option>
      <option>Juguetes y entretenimiento</option>
      <option>Alimentos y bebidas</option>
      <option>Automotriz</option>
      <option>Salud y farmacia</option>
      <option>Deportes y aire libre</option>
      <option>Oficina y escuela</option>
      <option>Otros</option>
    </select>
  `;
  container.appendChild(filtersDiv);

  // ===== AÑOS DISPONIBLES =====
  const years = [...new Set(items.map((i) => i.date.split("-")[2]))].sort();
  const yearFilter = filtersDiv.querySelector("#yearFilter");
  yearFilter.innerHTML =
    `<option value="">Año</option>` +
    years.map((y) => `<option value="${y}">${y}</option>`).join("");

  // ===== TABLA =====
  const table = document.createElement("table");
  table.className = "table table-hover align-middle table-theme";

  const renderRows = (data) => {
    if (data.length === 0)
      return `<tr><td colspan="7" class="text-center text-muted">Sin resultados</td></tr>`;
    return data
      .map(
        (item) => `
        <tr>
          <td>${item._id}</td>
          <td>${item.name}</td>
          <td>${item.qty}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.category}</td>
          <td>${item.date}</td>
          <td>
            <button class="btn btn-sm btn-outline-purple edit" data-id="${item._id}">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-sm btn-outline-danger delete" data-id="${item._id}">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </td>
        </tr>`
      )
      .join("");
  };

  const tbody = document.createElement("tbody");
  tbody.innerHTML = renderRows(items);

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Precio ($)</th>
        <th>Categoría</th>
        <th>Fecha</th>
        <th>Acciones</th>
      </tr>
    </thead>
  `;
  table.appendChild(tbody);
  container.appendChild(table);

  // ===== PAGINACIÓN =====
  const pagination = document.createElement("div");
  pagination.className =
    "d-flex justify-content-between align-items-center mt-3 pagination-controls";
  pagination.innerHTML = `
    <button class="btn btn-outline-purple" ${currentPage === 1 ? "disabled" : ""}>
      <i class="bi bi-arrow-left-circle"></i> Anterior
    </button>
    <span class="fw-semibold">Página ${currentPage} de ${totalPages}</span>
    <button class="btn btn-outline-purple" ${currentPage === totalPages ? "disabled" : ""}>
      Siguiente <i class="bi bi-arrow-right-circle"></i>
    </button>
  `;
  pagination.children[0].addEventListener("click", onPrevPage);
  pagination.children[2].addEventListener("click", onNextPage);
  container.appendChild(pagination);

  // ===== FILTRO DINÁMICO =====
  const searchInput = filtersDiv.querySelector(".search-input");
  const monthFilter = filtersDiv.querySelector("#monthFilter");
  const categoryFilter = filtersDiv.querySelector("#categoryFilter");

  function applyFilters() {
    const search = searchInput.value.toLowerCase();
    const year = yearFilter.value;
    const month = monthFilter.value;
    const category = categoryFilter.value;

    const filtered = items.filter((i) => {
      const matchesSearch =
        i.name.toLowerCase().includes(search) ||
        String(i._id).includes(search);
      const [day, mo, yr] = i.date.split("-");
      const matchesYear = !year || yr === year;
      const matchesMonth = !month || mo === String(month).padStart(2, "0");
      const matchesCategory = !category || i.category === category;
      return matchesSearch && matchesYear && matchesMonth && matchesCategory;
    });

    tbody.innerHTML = renderRows(filtered);

    // Reasignar eventos a los nuevos botones
    tbody.querySelectorAll(".edit").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        const item = items.find((it) => it._id === Number(id));
        if (item) onEdit(item);
      })
    );
    tbody.querySelectorAll(".delete").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const id = e.target.closest("button").dataset.id;
        onDelete(id);
      })
    );
  }

  [searchInput, yearFilter, monthFilter, categoryFilter].forEach((el) =>
    el.addEventListener("input", applyFilters)
  );

  // ===== MODO OSCURO =====
  const updateTableTheme = () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      table.classList.remove("table-dark");
    } else {
      table.classList.add("table-dark");
    }
  };
  updateTableTheme();
  const observer = new MutationObserver(updateTableTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  return container;
}
