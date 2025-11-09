// ======================================
// 🌐 Configuración base del backend
// ======================================
const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE) ||
  "http://localhost:3000/api";

// Normaliza URL (evita duplicar `/api/api`)
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

// ======================================
// ⚙️ Funciones utilitarias
// ======================================

/**
 * Normaliza el id de los elementos recibidos desde el backend.
 * Garantiza que todos los objetos tengan la propiedad `_id`.
 */
function normalizeId(item) {
  if (!item) return item;
  if (item._id) return item;
  if (item.id) return { ...item, _id: item.id };
  return item;
}

/**
 * Manejo centralizado de respuestas HTTP.
 * Devuelve JSON si la respuesta es válida, lanza error si no lo es.
 */
async function handleResponse(res, action = "procesar") {
  if (!res.ok) {
    let message = "";
    try {
      const text = await res.text();
      message = text || res.statusText;
    } catch {
      message = res.statusText;
    }
    console.error(`⚠️ Error al ${action}: ${res.status} - ${message}`);
    throw new Error(`Error al ${action}: ${message || res.statusText}`);
  }

  // Si no hay contenido (204), devolvemos vacío
  if (res.status === 204) return null;

  try {
    return await res.json();
  } catch {
    console.warn("⚠️ Respuesta vacía o no es JSON");
    return null;
  }
}

// ======================================
// 📦 Funciones principales de la API
// ======================================

/**
 * Obtiene todos los productos desde el backend.
 */
export async function getItems() {
  try {
    const res = await fetch(`${API_BASE}/items`, { credentials: "include" });
    const data = await handleResponse(res, "obtener los productos");
    return Array.isArray(data) ? data.map(normalizeId) : [];
  } catch (err) {
    console.error("❌ getItems:", err.message);
    throw err;
  }
}

/**
 * Crea un nuevo producto en el backend.
 */
export async function createItem(item) {
  try {
    const res = await fetch(`${API_BASE}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
      credentials: "include",
    });
    const data = await handleResponse(res, "crear el producto");
    return normalizeId(data);
  } catch (err) {
    console.error("❌ createItem:", err.message);
    throw err;
  }
}

/**
 * Actualiza un producto existente por su ID.
 */
export async function updateItem(id, updates) {
  try {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
      credentials: "include",
    });
    const data = await handleResponse(res, "actualizar el producto");
    return normalizeId(data);
  } catch (err) {
    console.error("❌ updateItem:", err.message);
    throw err;
  }
}

/**
 * Elimina un producto por su ID.
 */
export async function deleteItem(id) {
  try {
    const res = await fetch(`${API_BASE}/items/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await handleResponse(res, "eliminar el producto");
  } catch (err) {
    console.error("❌ deleteItem:", err.message);
    throw err;
  }
}
