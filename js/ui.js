// js/modules/ui.js
// Responsable de TODA la manipulación del DOM.

// --- Selectores del DOM ---
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const menuItemsContainer = document.getElementById("menu-items");

const cartModal = document.getElementById("cart-modal");
export const cartButton = document.getElementById("cart-button");
export const cartItemsContainer = document.getElementById(
  "cart-items-container"
);
export const cartTotalEl = document.getElementById("cart-total");
const cartCountBadge = document.getElementById("cart-count-badge");

const ratingModal = document.getElementById("rating-modal");
export const ratingForm = document.getElementById("rating-form");
export const ratingStarsContainer = document.querySelector(
  ".rating-stars-container"
);
const ratingStars = ratingStarsContainer.querySelectorAll("i");
const ratingItemName = document.getElementById("rating-item-name");
export const ratingItemIdInput = document.getElementById("rating-item-id");
export const ratingValueInput = document.getElementById("rating-value");
export const ratingNombreInput = document.getElementById("rating-nombre");
export const ratingComentarioInput =
  document.getElementById("rating-comentario");

const extrasModal = document.getElementById("extras-modal");
export const extrasListContainer = document.getElementById(
  "extras-list-container"
);
const extrasItemName = document.getElementById("extras-item-name");
const extrasItemTotal = document.getElementById("extras-item-total");
export const addToCartFromModalBtn = document.getElementById(
  "add-to-cart-from-modal-btn"
);

// --- Estado local de la UI ---
let currentRating = 0;
let currentExtrasItem = null; // Esto ahora será un item *del carrito*

/**
 * Permite a main.js saber qué item se está configurando.
 */
export function getCurrentExtrasItem() {
  return currentExtrasItem;
}

// =============================================
// ===== MANEJO DE MODALES Y NAVEGACIÓN =====
// =============================================

export function initNav() {
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    });
  });
}

export function initModalClosers() {
  cartModal
    .querySelector("#close-cart-btn")
    .addEventListener("click", toggleCartModal);
  cartModal
    .querySelector("#cart-overlay")
    .addEventListener("click", toggleCartModal);
  ratingModal
    .querySelector("#close-rating-btn")
    .addEventListener("click", toggleRatingModal);
  ratingModal
    .querySelector("#rating-overlay")
    .addEventListener("click", toggleRatingModal);
  extrasModal
    .querySelector("#close-extras-btn")
    .addEventListener("click", toggleExtrasModal);
  extrasModal
    .querySelector("#extras-overlay")
    .addEventListener("click", toggleExtrasModal);
}

export function toggleCartModal() {
  cartModal.classList.toggle("hidden");
}
export function toggleRatingModal() {
  ratingModal.classList.toggle("hidden");
}
export function toggleExtrasModal() {
  extrasModal.classList.toggle("hidden");
}

// =============================================
// ===== RENDERIZADO DEL MENÚ Y EXTRAS =====
// =============================================

/**
 * MODIFICADO: Ahora edita un item existente del carrito.
 * @param {object} cartItem - El item *del carrito* (no del menú).
 * @param {Array} extrasList - La lista completa de extras.
 */
export function openExtrasModal(cartItem, extrasList) {
  currentExtrasItem = cartItem; // Guarda el item del carrito
  extrasItemName.textContent = cartItem.baseItem.nombre;

  // Cambia el texto del botón
  addToCartFromModalBtn.textContent = "Actualizar Item";

  extrasListContainer.innerHTML = "";

  // Crea un Set de los IDs de extras que el item ya tiene
  const currentExtraIds = new Set(cartItem.extras.map((e) => e.id_extra));

  extrasList.forEach((extra) => {
    const isChecked = currentExtraIds.has(extra.id_extra) ? "checked" : "";
    const extraEl = document.createElement("label");
    extraEl.className = "extras-item";
    extraEl.innerHTML = `
      <input type="checkbox" class="extras-checkbox" 
             data-id="${extra.id_extra}" 
             data-nombre="${extra.nombre}" 
             data-precio="${extra.precio}"
             ${isChecked}>
      <span>${extra.nombre}</span>
      <span class="extras-price">+$${parseFloat(extra.precio).toFixed(2)}</span>
    `;
    extrasListContainer.appendChild(extraEl);
  });

  extrasListContainer.querySelectorAll(".extras-checkbox").forEach((cb) => {
    cb.addEventListener("change", () =>
      updateExtrasTotal(cartItem.baseItem.precio)
    );
  });

  updateExtrasTotal(cartItem.baseItem.precio);
  toggleExtrasModal();
}

function updateExtrasTotal(basePrice) {
  let total = parseFloat(basePrice);
  extrasListContainer
    .querySelectorAll(".extras-checkbox:checked")
    .forEach((cb) => {
      total += parseFloat(cb.dataset.precio);
    });
  extrasItemTotal.textContent = `$${total.toFixed(2)}`;
}

/**
 * Renderiza los platillos. El handler "Añadir" ahora es de un solo clic.
 */
export function renderMenuItems(
  items,
  extrasList, // Este argumento se mantiene para la firma, aunque no se use aquí
  cart,
  cartClickHandler,
  quantityClickHandler,
  ratingClickHandler
) {
  menuItemsContainer.innerHTML = "";

  if (items.length === 0) {
    menuItemsContainer.innerHTML =
      '<p class="text-center text-gray-500 col-span-full">No hay platillos disponibles en esta categoría.</p>';
    return;
  }

  items.forEach((item) => {
    const itemElement = document.createElement("div");
    // --- ### INICIO DE LA MODIFICACIÓN ### ---

    // Si NO tiene foto, quitamos 'overflow-hidden' para que la sombra se vea bien
    const cardClasses = item.foto
      ? "bg-white rounded-xl overflow-hidden menu-card"
      : "bg-white rounded-xl menu-card";

    itemElement.className = cardClasses;

    let imageHtml = ""; // Por defecto, el HTML de la imagen estará vacío
    if (item.foto) {
      // Si SÍ tiene foto, creamos la etiqueta <img>
      imageHtml = `<img src="assets/images/${item.foto}" alt="${item.nombre}" class="h-48 w-full object-cover" loading="lazy">`;
    }
    // Si no hay foto, imageHtml se queda como "" y no se renderiza nada.

    // --- ### FIN DE LA MODIFICACIÓN ### ---

    const ratingHTML = generateRatingHTML(
      item.avg_rating,
      item.total_ratings,
      item.id,
      item.nombre
    );

    // --- LÓGICA DE BOTÓN/CONTADOR ---

    const itemInCart = cart.find(
      (cartItem) =>
        cartItem.baseItem.id === item.id && cartItem.extras.length === 0
    );

    let actionButtonHTML = "";
    if (itemInCart) {
      actionButtonHTML = `
        <div class="item-quantity-control" data-cart-item-id="${itemInCart.cartItemId}">
          <button class="btn-decrease-card" data-change="-1">-</button>
          <span class="quantity-display">${itemInCart.quantity}</span>
          <button class="btn-increase-card" data-change="1">+</button>
        </div>
      `;
    } else {
      actionButtonHTML = `
        <button class="add-to-cart-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">Añadir</button>
      `;
    }
    // --- FIN DE LA NUEVA LÓGICA ---

    itemElement.innerHTML = `
      ${imageHtml} <div class="p-5">
          <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg">${item.nombre}</h3>
              <span class="text-red-600 font-bold text-lg">$${parseFloat(
                item.precio
              ).toFixed(2)}</span>
          </div>
          <p class="text-gray-600 mb-4">${item.descripcion || ""}</p>
          <div class="flex justify-between items-center">
              ${ratingHTML}
              ${actionButtonHTML} 
          </div>
      </div>
    `;

    // --- ADJUNTAR LISTENERS ---

    if (itemInCart) {
      itemElement
        .querySelector(".btn-decrease-card")
        .addEventListener("click", () => {
          quantityClickHandler(itemInCart.cartItemId, -1);
        });
      itemElement
        .querySelector(".btn-increase-card")
        .addEventListener("click", () => {
          quantityClickHandler(itemInCart.cartItemId, 1);
        });
    } else {
      const btn = itemElement.querySelector(".add-to-cart-btn");
      btn.addEventListener("click", () => {
        cartClickHandler(item); // Llama al handler de 'main.js'
      });
    }

    itemElement.querySelector(".rate-btn").addEventListener("click", () => {
      ratingClickHandler(item.id, item.nombre);
    });

    menuItemsContainer.appendChild(itemElement);
  });
}

// =============================================
// ===== RENDERIZADO DE CALIFICACIONES =====
// =============================================

function generateRatingHTML(avgRating, totalRatings, itemId, itemName) {
  const rating = parseFloat(avgRating);
  const percentage = (rating / 5) * 100;

  // Formatea a dos decimales
  const formattedRating = rating.toFixed(2);

  return `
    <div class="rating-display" data-id="${itemId}">
      <div class="stars-outer">
        <div class="stars-inner" style="width: ${percentage}%;">
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
      </div>
       <span class="rating-count">${formattedRating} (${totalRatings})</span>
      <button class="rate-btn text-xs text-blue-500 hover:underline ml-2" data-id="${itemId}" data-name="${itemName}">Calificar</button>
    </div>
  `;
}

export function openRatingModal(id, name) {
  // ... (sin cambios)
  ratingItemName.textContent = name;
  ratingItemIdInput.value = id;
  currentRating = 0;
  ratingValueInput.value = 0;
  ratingNombreInput.value = "";
  ratingComentarioInput.value = "";
  updateRatingStarsVisual(0);
  toggleRatingModal();
}

export function updateRatingStarsVisual(newRating) {
  // ... (sin cambios)
  currentRating = newRating;
  ratingStars.forEach((star) => {
    star.classList.remove("selected", "text-yellow-500", "text-gray-300");
    star.dataset.value <= currentRating
      ? star.classList.add("selected", "text-yellow-500")
      : star.classList.add("text-gray-300");
  });
}

export function updateMenuItemRating(id, newData, ratingClickHandler) {
  // ... (sin cambios)
  const itemCard = document.querySelector(`.rating-display[data-id="${id}"]`);
  if (itemCard) {
    const itemName = itemCard.querySelector(".rate-btn").dataset.name;
    itemCard.innerHTML = generateRatingHTML(
      newData.avg_rating,
      newData.total_ratings,
      id,
      itemName
    );
    itemCard.querySelector(".rate-btn").addEventListener("click", () => {
      ratingClickHandler(id, itemName);
    });
  }
}

// =============================================
// ===== RENDERIZADO DEL CARRITO (MODIFICADO) =====
// =============================================

export function updateCartBadge(cart) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountBadge.textContent = totalItems;
}

/**
 * MODIFICADO: Ahora añade el botón "Editar extras"
 */
export function renderCartItems(cart, quantityHandler, editExtrasHandler) {
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="text-center text-gray-500">Tu carrito está vacío.</p>';
    cartTotalEl.textContent = "$0.00";
    return;
  }

  let cartTotal = 0;

  cart.forEach((item) => {
    let itemPrice = parseFloat(item.baseItem.precio);
    let extrasHtml = "";

    // Renderiza la lista de extras si existen
    if (item.extras.length > 0) {
      extrasHtml = '<ul class="text-sm text-gray-500 pl-4 mt-1">';
      item.extras.forEach((extra) => {
        itemPrice += extra.precio;
        extrasHtml += `<li>+ ${extra.nombre} ($${extra.precio.toFixed(
          2
        )})</li>`;
      });
      extrasHtml += "</ul>";
    }

    const itemTotalPrice = itemPrice * item.quantity;
    cartTotal += itemTotalPrice;

    const itemEl = document.createElement("div");
    itemEl.className = "flex justify-between items-center mb-4";
    itemEl.innerHTML = `
      <div class="flex-1 pr-4">
          <h4 class="font-bold">${item.baseItem.nombre}</h4>
          <span class="text-sm text-gray-600">$${itemPrice.toFixed(
            2
          )} c/u</span>
          ${extrasHtml}
          <button class="edit-extras-btn" data-cart-item-id="${
            item.cartItemId
          }">
            + ${item.extras.length > 0 ? "Editar extras" : "Añadir extras"}
          </button>
      </div>
      <div class="cart-item-controls">
          <button class="btn-decrease" data-id="${item.cartItemId}">-</button>
          <span>${item.quantity}</span>
          <button class="btn-increase" data-id="${item.cartItemId}">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  cartTotalEl.textContent = `$${cartTotal.toFixed(2)}`;

  // Adjunta los listeners a los nuevos botones +/-
  cartItemsContainer.querySelectorAll(".btn-decrease").forEach((btn) => {
    btn.addEventListener("click", () => quantityHandler(btn.dataset.id, -1));
  });
  cartItemsContainer.querySelectorAll(".btn-increase").forEach((btn) => {
    btn.addEventListener("click", () => quantityHandler(btn.dataset.id, 1));
  });

  // Adjunta los listeners a los nuevos botones "Editar extras"
  cartItemsContainer.querySelectorAll(".edit-extras-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      editExtrasHandler(btn.dataset.cartItemId)
    );
  });
}
