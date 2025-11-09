export function createForm(onSubmit) {
  const container = document.createElement("div");
  container.className = "card card-body shadow-sm";

  container.innerHTML = `
    <h5 class="mb-3 text-purple fw-bold">Registrar nuevo producto</h5>
    <form id="itemForm" autocomplete="off">
      <div class="row g-3">

        <div class="col-md-3">
          <label class="form-label fw-semibold">Nombre del Producto</label>
          <input 
            name="name" 
            class="form-control input-theme" 
            required 
          />
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold">Cantidad</label>
          <input 
            name="qty" 
            type="number" 
            class="form-control input-theme" 
            min="0" 
            required 
          />
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold">Precio ($)</label>
          <input 
            name="price" 
            type="number" 
            step="0.01" 
            class="form-control input-theme" 
            min="0" 
            required 
          />
        </div>

        <div class="col-md-3">
          <label class="form-label fw-semibold">Categoría</label>
          <select name="category" class="form-select input-theme" required>
            <option value="" selected disabled>Seleccionar categoría</option>
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
        </div>

      </div>

      <div class="d-flex justify-content-end mt-4">
        <button class="btn btn-purple px-4 fw-semibold" type="submit">
          Registrar producto
        </button>
      </div>
    </form>
  `;

  const form = container.querySelector("#itemForm");

  // Detecta el cambio de tema para actualizar estilos de inputs dinámicamente
  const updateInputTheme = () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    form.querySelectorAll(".input-theme").forEach((el) => {
      if (isLight) {
        el.style.backgroundColor = "#ffffff";
        el.style.color = "#000000";
        el.style.border = "1px solid #ccc";
      } else {
        el.style.backgroundColor = "#1e1e1e";
        el.style.color = "#ffffff";
        el.style.border = "1px solid #555";
      }
    });
  };

  // Ejecuta el estilo inicial y escucha cambios en el modo de tema
  updateInputTheme();
  const observer = new MutationObserver(updateInputTheme);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: form.name.value.trim(),
      qty: Number(form.qty.value),
      price: Number(form.price.value),
      category: form.category.value.trim(),
    };

    if (!data.name || !data.category || isNaN(data.qty) || isNaN(data.price)) return;

    onSubmit(data);
    form.reset();
  });

  return container;
}
