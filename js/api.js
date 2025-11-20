// js/modules/api.js

export async function loadExtras() {
  try {
    const response = await fetch("api/get_extras.php");
    if (!response.ok) throw new Error("No se pudieron cargar los extras.");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchMenu(category) {
  const response = await fetch(`api/get_menu.php?category=${category}`);
  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
  }
  const items = await response.json();
  if (items.error) {
    throw new Error(items.error);
  }
  return items;
}

export async function submitRating(data) {
  const response = await fetch("api/submit_rating.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la respuesta del servidor.");
  return await response.json();
}

export async function saveMessage(data) {
  const response = await fetch("api/save_message.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error en la respuesta del servidor.");
  return await response.json();
}
