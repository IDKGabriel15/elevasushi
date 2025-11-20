// js/main.js
// El "Conductor" de la aplicación.

// 1. IMPORTAR MÓDULOS
import * as api from "./api.js";
import * as ui from "./ui.js";
import * as cart from "./cart.js";

// 2. ESTADO GLOBAL DE LA APLICACIÓN
let extrasList = [];
let currentMenuItems = []; // Mantiene los items que se están mostrando
let currentCategory = "entradas"; // Mantiene la categoría actual

// 3. HANDLERS (Funciones "pegamento")

// ... (handleContactSubmit y handleRatingSubmit siguen igual) ...
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    const result = await api.saveMessage(data);
    if (result.success) {
      Swal.fire({
        title: "¡Enviado!",
        text: "¡Mensaje enviado con éxito!",
        icon: "success",
      });
      form.reset();
    } else {
      Swal.fire({
        title: "Error",
        text: result.error || "No se pudo enviar el mensaje.",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    Swal.fire({
      title: "Error",
      text: "Error de conexión.",
      icon: "error",
    });
  }
}
async function handleRatingSubmit(e) {
  e.preventDefault();
  const data = {
    id_menu_item: parseInt(ui.ratingItemIdInput.value),
    rating: parseInt(ui.ratingValueInput.value),
    nombre: ui.ratingNombreInput.value,
    comentario: ui.ratingComentarioInput.value,
  };
  if (data.rating === 0) {
    Swal.fire({
      title: "Atención",
      text: "Por favor, selecciona de 1 a 5 estrellas.",
      icon: "warning",
    });
    return;
  }
  try {
    const result = await api.submitRating(data);
    if (result.success) {
      Swal.fire({
        title: "¡Gracias!",
        text: "¡Gracias por tu calificación!",
        icon: "success",
      });
      ui.toggleRatingModal();
      ui.updateMenuItemRating(
        data.id_menu_item,
        result.new_data,
        handleRatingClick
      );
    } else {
      Swal.fire({
        title: "Error",
        text: result.error || "No se pudo enviar la calificación.",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("Error al enviar calificación:", error);
    Swal.fire({
      title: "Error",
      text: "Error de conexión.",
      icon: "error",
    });
  }
}

/**
 * MODIFICADO: Añade el item al carrito (sin extras) y actualiza la UI.
 */
function handleMenuAddClick(item) {
  cart.addToCart(item, []); // Añade al carrito con extras vacíos

  // --- NUEVA NOTIFICACIÓN ---
  Swal.fire({
    title: "¡Añadido!",
    text: `${item.nombre} se añadió a tu carrito.`,
    icon: "success",
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
  // --- FIN DE NOTIFICACIÓN ---

  // Vuelve a renderizar la UI para mostrar el contador
  refreshAllUI();
}

function handleRatingClick(id, name) {
  ui.openRatingModal(id, name);
}

/**
 * MODIFICADO: Se llama al pulsar "Actualizar Item" en el modal de extras.
 */
function handleExtrasSubmit() {
  const currentItem = ui.getCurrentExtrasItem();
  const selectedExtras = [];
  ui.extrasListContainer
    .querySelectorAll(".extras-checkbox:checked")
    .forEach((cb) => {
      selectedExtras.push({
        id_extra: parseInt(cb.dataset.id),
        nombre: cb.dataset.nombre,
        precio: parseFloat(cb.dataset.precio),
      });
    });

  cart.updateItemExtras(currentItem.cartItemId, selectedExtras);

  // Vuelve a renderizar la UI
  ui.toggleExtrasModal();
  refreshAllUI();
}

/**
 * NUEVO: Se llama al pulsar "+ Editar extras" DENTRO del carrito.
 */
function handleEditExtrasClick(cartItemId) {
  const item = cart.getItemById(cartItemId);
  if (item) {
    ui.openExtrasModal(item, extrasList);
  }
}

/**
 * MODIFICADO: Ahora se llama handleCardQuantityChange o handleCartQuantityChange
 */
function handleCartQuantityChange(cartItemId, change) {
  cart.updateQuantity(cartItemId, change);
  refreshAllUI();
}

/**
 * NUEVO: Maneja los clics de +/- EN LA TARJETA DEL MENÚ.
 * Es idéntico a handleCartQuantityChange pero separado por claridad.
 */
function handleCardQuantityChange(cartItemId, change) {
  cart.updateQuantity(cartItemId, change);
  refreshAllUI();
}

function handleStarClick(e) {
  if (e.target.tagName === "I") {
    const newRating = parseInt(e.target.dataset.value);
    ui.ratingValueInput.value = newRating;
    ui.updateRatingStarsVisual(newRating);
  }
}

// (En js/main.js)
function handleSendWhatsApp() {
  const url = cart.getWhatsAppMessage();
  if (url) {
    window.open(url, "_blank"); // Abre WhatsApp
    cart.clearCart(); // Llama a la nueva función
    refreshAllUI();
  }
}
/**
 * NUEVO: Función central para actualizar toda la UI
 * Esto sincroniza las tarjetas del menú y el carrito.
 */
function refreshAllUI() {
  const currentCart = cart.getCart();
  // Vuelve a renderizar las tarjetas del menú
  ui.renderMenuItems(
    currentMenuItems,
    extrasList,
    currentCart, // <-- ### CORRECCIÓN 1: Se añadió 'currentCart' ###
    handleMenuAddClick,
    handleCardQuantityChange, // Se pasa el handler del contador
    handleRatingClick
  );
  // Vuelve a renderizar los items del carrito
  ui.renderCartItems(
    currentCart,
    handleCartQuantityChange, // Se pasa el handler del carrito
    handleEditExtrasClick
  );
  // Actualiza el badge
  ui.updateCartBadge(currentCart);
}

/**
 * Función principal para inicializar la sección del Menú.
 */
async function initMenu() {
  const menuItemsContainer = document.getElementById("menu-items");
  if (!menuItemsContainer) return;

  try {
    menuItemsContainer.innerHTML =
      '<p class="text-center col-span-full">Cargando...</p>';
    extrasList = await api.loadExtras();

    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        categoryButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        currentCategory = this.getAttribute("data-category"); // Actualiza categoría actual
        menuItemsContainer.innerHTML =
          '<p class="text-center col-span-full">Cargando menú...</p>';

        try {
          currentMenuItems = await api.fetchMenu(currentCategory); // Actualiza items actuales
          // Renderiza el menú pasando el estado actual del carrito
          ui.renderMenuItems(
            currentMenuItems,
            extrasList,
            cart.getCart(), // <-- ### CORRECCIÓN 2: Se añadió 'cart.getCart()' ###
            handleMenuAddClick,
            handleCardQuantityChange,
            handleRatingClick
          );
        } catch (error) {
          console.error(error);
          menuItemsContainer.innerHTML =
            '<p class="text-center text-red-500 col-span-full">Error al cargar el menú.</p>';
        }
      });
    });

    // Carga de categoría inicial ("entradas")
    currentMenuItems = await api.fetchMenu(currentCategory);
    ui.renderMenuItems(
      currentMenuItems,
      extrasList,
      cart.getCart(), // <-- ### CORRECCIÓN 3: Se añadió 'cart.getCart()' ###
      handleMenuAddClick,
      handleCardQuantityChange,
      handleRatingClick
    );
  } catch (error) {
    console.error("No se pudieron cargar los datos iniciales:", error);
    menuItemsContainer.innerHTML =
      '<p class="text-center text-red-500 col-span-full">Error de conexión inicial.</p>';
  }
}

/**
 * Inicializa los botones de "Añadir al Pedido" de la sección de promociones.
 */
function initPromoButtons() {
  const promoButtons = document.querySelectorAll(".promo-add-btn");

  promoButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // 1. Lee los datos de la promoción desde el botón
      const promoItem = {
        id: button.dataset.id,
        nombre: button.dataset.nombre,
        precio: parseFloat(button.dataset.precio),
      };

      // 2. Llama a la función del carrito para añadir el item (sin extras)
      cart.addToCart(promoItem, []);

      // 3. Muestra una notificación (Posición corregida)
      Swal.fire({
        title: "¡Añadido!",
        text: `${promoItem.nombre} se añadió a tu carrito.`,
        icon: "success",
        toast: true,
        position: "top-start", // <-- CAMBIO DE 'top-end' A 'top-start'
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      // 4. Actualiza el contador del ícono del carrito
      ui.updateCartBadge(cart.getCart());

      // 5. ### CORRECCIÓN DEL BUG ###
      // Vuelve a dibujar la lista de items DENTRO del modal del carrito
      ui.renderCartItems(
        cart.getCart(),
        handleCartQuantityChange,
        handleEditExtrasClick
      );
    });
  });
}

// =============================================
// ===== PUNTO DE ENTRADA DE LA APLICACIÓN =====
// =============================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Inicializa componentes de UI
  ui.initNav();
  ui.initModalClosers();

  // 2. Conecta botones de acción a sus handlers
  ui.cartButton.addEventListener("click", ui.toggleCartModal);
  document
    .getElementById("send-whatsapp-btn")
    .addEventListener("click", handleSendWhatsApp);
  ui.ratingForm.addEventListener("submit", handleRatingSubmit);
  ui.ratingStarsContainer.addEventListener("click", handleStarClick);
  ui.addToCartFromModalBtn.addEventListener("click", handleExtrasSubmit);

  // 3. Inicializa el formulario de contacto
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // 4. Lanza la carga del menú
  initMenu();

  //5. Inicia botones promo
  initPromoButtons();

  // 6. Renderiza el carrito vacío al inicio
  ui.renderCartItems(
    cart.getCart(),
    handleCartQuantityChange,
    handleEditExtrasClick
  );
  ui.updateCartBadge(cart.getCart());
});
