// js/cart.js
// Módulo de lógica de negocio del carrito. No toca el DOM.

// --- Estado del Carrito ---
// MODIFICADO: Intenta cargar el carrito desde localStorage,
// si no existe, empieza como un array vacío.
let cart = JSON.parse(localStorage.getItem("elevaCart")) || [];

// --- NUEVA FUNCIÓN INTERNA ---
/**
 * Guarda el estado actual del carrito en localStorage.
 */
function saveCart() {
  localStorage.setItem("elevaCart", JSON.stringify(cart));
}

// --- Funciones Exportadas ---

/**
 * Devuelve el estado actual del carrito.
 */
export function getCart() {
  return cart;
}

/**
 * NUEVO: Busca un item en el carrito solo por su ID base y sin extras.
 * Esto es para que la UI de la tarjeta del menú sepa si mostrar "Añadir" o el contador.
 */
export function getBaseItemInCart(baseItemId) {
  // Busca un item que tenga el mismo ID base Y 0 extras
  return cart.find(
    (item) => item.baseItem.id === baseItemId && item.extras.length === 0
  );
}

/**
 * Añade un item y sus extras al estado del carrito.
 * Devuelve 'true' si fue exitoso.
 */
export function addToCart(item, selectedExtras) {
  const baseId = item.id;
  const extrasIds = selectedExtras
    .map((e) => e.id_extra)
    .sort()
    .join("-");
  const uniqueCartItemId = `${baseId}-${extrasIds || "base"}`;

  const existingItem = cart.find((ci) => ci.cartItemId === uniqueCartItemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      cartItemId: uniqueCartItemId,
      baseItem: item,
      extras: selectedExtras,
      quantity: 1,
    });
  }

  saveCart(); // <-- AÑADIDO
  return true; // Devuelve éxito
}

/**
 * Busca un item en el carrito por su ID único.
 */
export function getItemById(cartItemId) {
  return cart.find((ci) => ci.cartItemId === cartItemId);
}

/**
 * Actualiza la lista de extras de un item que YA ESTÁ en el carrito.
 */
export function updateItemExtras(cartItemId, newExtrasList) {
  const item = getItemById(cartItemId);
  if (!item) return false;

  // Crea un nuevo ID único basado en los nuevos extras
  const baseId = item.baseItem.id;
  const extrasIds = newExtrasList
    .map((e) => e.id_extra)
    .sort()
    .join("-");
  const newUniqueCartItemId = `${baseId}-${extrasIds || "base"}`;

  // Si esta nueva combinación ya existe en el carrito (excepto el item actual),
  // fusionamos las cantidades.
  const existingItem = cart.find(
    (ci) =>
      ci.cartItemId === newUniqueCartItemId && ci.cartItemId !== cartItemId
  );

  if (existingItem) {
    existingItem.quantity += item.quantity; // Suma la cantidad al item existente
    cart = cart.filter((ci) => ci.cartItemId !== cartItemId); // Elimina el item original
  } else {
    // Simplemente actualiza el item actual
    item.extras = newExtrasList;
    item.cartItemId = newUniqueCartItemId;
  }

  saveCart(); // <-- AÑADIDO
  return true;
}

/**
 * Actualiza la cantidad de un item en el carrito.
 */
export function updateQuantity(cartItemId, change) {
  const item = getItemById(cartItemId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((ci) => ci.cartItemId !== cartItemId);
    }
  }

  saveCart(); // <-- AÑADIDO
}

/**
 * Genera el texto para WhatsApp.
 */
export function getWhatsAppMessage() {
  if (cart.length === 0) {
    Swal.fire({
      // Usando SweetAlert como ya lo habías implementado
      title: "Carrito Vacío",
      text: "Tu carrito está vacío. Añade productos para hacer un pedido.",
      icon: "warning",
    });
    return null;
  }
  const numeroWhatsApp = "526671021244";
  let cartTotal = 0;
  let mensaje =
    "¡Hola ELEVA SUSHI & WOK! 🍣🥢\n\nQuisiera hacer el siguiente pedido:\n\n";

  cart.forEach((item) => {
    let itemPrice = parseFloat(item.baseItem.precio);
    let extrasTexto = "";
    item.extras.forEach((extra) => {
      itemPrice += extra.precio;
      extrasTexto += `\n    + ${extra.nombre} ($${extra.precio.toFixed(2)})`;
    });

    const itemTotalPrice = itemPrice * item.quantity;
    cartTotal += itemTotalPrice;

    mensaje += `*${item.baseItem.nombre}* (x${
      item.quantity
    }) - $${itemTotalPrice.toFixed(2)}\n`;
    if (extrasTexto) {
      mensaje += extrasTexto + "\n";
    }
  });

  mensaje += `\n*Total del Pedido: $${cartTotal.toFixed(2)}*\n\n`;
  mensaje += "Por favor, confírmenme mi pedido. ¡Gracias!";

  const encodedMensaje = encodeURIComponent(mensaje);
  return `https://wa.me/${numeroWhatsApp}?text=${encodedMensaje}`;
}

export function clearCart() {
  cart = [];
  saveCart(); // (saveCart ya la creamos)
}
