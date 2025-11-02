// app.js ACTUALIZADO CON LÓGICA DE CARRITO Y CALIFICACIONES

document.addEventListener("DOMContentLoaded", () => {
  // --- Estado Global del Carrito ---
  let cart = [];
  let currentRating = 0; // Para el modal de calificación

  // --- Selectores de Elementos del DOM ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const menuItemsContainer = document.getElementById("menu-items");

  // --- Selectores del Carrito ---
  const cartButton = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountBadge = document.getElementById("cart-count-badge");
  const sendWhatsAppBtn = document.getElementById("send-whatsapp-btn");

  // --- Selectores de Calificación ---
  const ratingModal = document.getElementById("rating-modal");
  const ratingOverlay = document.getElementById("rating-overlay");
  const closeRatingBtn = document.getElementById("close-rating-btn");
  const ratingItemName = document.getElementById("rating-item-name");
  const ratingStarsContainer = document.querySelector(
    ".rating-stars-container"
  );
  const ratingStars = ratingStarsContainer.querySelectorAll("i");
  const ratingForm = document.getElementById("rating-form");
  const ratingItemIdInput = document.getElementById("rating-item-id");
  const ratingValueInput = document.getElementById("rating-value");
  const ratingNombreInput = document.getElementById("rating-nombre");
  const ratingComentarioInput = document.getElementById("rating-comentario");

  // --- Lógica del Menú Móvil (Sin cambios) ---
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // --- Navegación suave (Smooth Scroll) (Sin cambios) ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (!mobileMenu.classList.contains("hidden")) {
          mobileMenu.classList.add("hidden");
        }
      }
    });
  });

  // =============================================
  // ===== INICIO: LÓGICA DEL CARRITO DE COMPRAS =====
  // =============================================

  function toggleCartModal() {
    cartModal.classList.toggle("hidden");
  }

  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadge.textContent = totalItems;
  }

  function renderCartItems() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="text-center text-gray-500">Tu carrito está vacío.</p>';
      return;
    }

    let total = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const itemEl = document.createElement("div");
      itemEl.className = "flex justify-between items-center mb-4";
      itemEl.innerHTML = `
        <div>
            <h4 class="font-bold">${item.name}</h4>
            <span class="text-sm text-gray-600">$${parseFloat(
              item.price
            ).toFixed(2)} c/u</span>
        </div>
        <div class="cart-item-controls">
            <button class="btn-decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="btn-increase" data-id="${item.id}">+</button>
        </div>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartTotalEl.textContent = `$${total.toFixed(2)}`;

    cartItemsContainer.querySelectorAll(".btn-decrease").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateQuantity(parseInt(btn.dataset.id), -1)
      );
    });
    cartItemsContainer.querySelectorAll(".btn-increase").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateQuantity(parseInt(btn.dataset.id), 1)
      );
    });
  }

  /**
   * REFACTOR: El 'item' ahora tiene 'id'
   */
  function addToCart(item) {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: item.id, // ID del platillo
        name: item.nombre,
        price: parseFloat(item.precio),
        quantity: 1,
      });
    }

    renderCartItems();
    updateCartBadge();
  }

  /**
   * REFACTOR: Buscar por 'id' (int) en lugar de 'name' (string)
   */
  function updateQuantity(id, change) {
    const item = cart.find((cartItem) => cartItem.id === id);

    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cart = cart.filter((cartItem) => cartItem.id !== id);
      }
    }

    renderCartItems();
    updateCartBadge();
  }

  function sendWhatsAppMessage() {
    // ... (Función de WhatsApp sin cambios) ...
    if (cart.length === 0) {
      alert("Tu carrito está vacío. Añade productos para hacer un pedido.");
      return;
    }
    const numeroWhatsApp = "526675142646";
    let total = 0;
    let mensaje =
      "¡Hola ELEVA SUSHI & WOK! 🍣🥢\n\nQuisiera hacer el siguiente pedido:\n\n";
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      mensaje += `*${item.name}* (x${item.quantity}) - $${itemTotal.toFixed(
        2
      )}\n`;
    });
    mensaje += `\n*Total del Pedido: $${total.toFixed(2)}*\n\n`;
    mensaje += "Por favor, confírmenme mi pedido. ¡Gracias!";
    const encodedMensaje = encodeURIComponent(mensaje);
    const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodedMensaje}`;
    window.open(whatsappURL, "_blank");
  }

  // --- Listeners del Carrito ---
  cartButton.addEventListener("click", toggleCartModal);
  closeCartBtn.addEventListener("click", toggleCartModal);
  cartOverlay.addEventListener("click", toggleCartModal);
  sendWhatsAppBtn.addEventListener("click", sendWhatsAppMessage);

  // =============================================
  // ===== INICIO: LÓGICA DE CALIFICACIONES =====
  // =============================================

  function toggleRatingModal() {
    ratingModal.classList.toggle("hidden");
  }

  function openRatingModal(id, name) {
    ratingItemName.textContent = name;
    ratingItemIdInput.value = id;
    // Resetear formulario
    currentRating = 0;
    ratingValueInput.value = 0;
    ratingNombreInput.value = "";
    ratingComentarioInput.value = "";
    updateRatingStarsVisual();
    toggleRatingModal();
  }

  function updateRatingStarsVisual() {
    ratingStars.forEach((star) => {
      star.classList.remove("selected", "text-yellow-500", "text-gray-300");
      if (star.dataset.value <= currentRating) {
        star.classList.add("selected", "text-yellow-500");
      } else {
        star.classList.add("text-gray-300");
      }
    });
  }

  // Listeners para las estrellas
  ratingStarsContainer.addEventListener("click", (e) => {
    if (e.target.tagName === "I") {
      currentRating = parseInt(e.target.dataset.value);
      ratingValueInput.value = currentRating;
      updateRatingStarsVisual();
    }
  });

  // Enviar el formulario de calificación
  ratingForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (currentRating === 0) {
      alert("Por favor, selecciona de 1 a 5 estrellas.");
      return;
    }

    const data = {
      id_menu_item: parseInt(ratingItemIdInput.value),
      rating: currentRating,
      nombre: ratingNombreInput.value,
      comentario: ratingComentarioInput.value,
    };

    try {
      const response = await fetch("api/submit_rating.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("¡Gracias por tu calificación!");
        toggleRatingModal();
        // Actualizar las estrellas en la tarjeta del menú
        updateMenuItemRating(data.id_menu_item, result.new_data);
      } else {
        alert(
          "Error: " + (result.error || "No se pudo enviar la calificación.")
        );
      }
    } catch (error) {
      console.error("Error al enviar calificación:", error);
      alert("Error de conexión. Intente más tarde.");
    }
  });

  // Función para actualizar las estrellas en la página (sin recargar)
  function updateMenuItemRating(id, newData) {
    const itemCard = document.querySelector(`.rating-display[data-id="${id}"]`);
    if (itemCard) {
      itemCard.innerHTML = generateRatingHTML(
        newData.avg_rating,
        newData.total_ratings,
        id
      );
    }
  }

  // --- Listeners del Modal de Calificación ---
  closeRatingBtn.addEventListener("click", toggleRatingModal);
  ratingOverlay.addEventListener("click", toggleRatingModal);

  // =============================================
  // ===== INICIO: LÓGICA DE MENÚ DINÁMICO =====
  // =============================================

  /**
   * Genera el HTML para las estrellas dinámicas
   */
  function generateRatingHTML(avgRating, totalRatings, itemId) {
    const rating = parseFloat(avgRating);
    const percentage = (rating / 5) * 100;

    return `
      <div class="rating-display" data-id="${itemId}">
        <div class="stars-outer">
          <div class="stars-inner" style="width: ${percentage}%;">
            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
          </div>
          <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
        </div>
        <span class="rating-count">(${totalRatings})</span>
        <button class="rate-btn text-xs text-blue-500 hover:underline ml-2" data-id="${itemId}" data-name="">Calificar</button>
      </div>
    `;
  }

  /**
   * Función para renderizar elementos del menú en el DOM.
   * MODIFICADA: Muestra estrellas reales y botón de calificar.
   */
  function renderMenuItems(items = []) {
    menuItemsContainer.innerHTML = "";

    if (items.length === 0) {
      menuItemsContainer.innerHTML =
        '<p class="text-center text-gray-500 col-span-full">No hay platillos disponibles en esta categoría.</p>';
      return;
    }

    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "bg-white rounded-xl overflow-hidden menu-card";

      const imageUrl = item.foto
        ? `images/${item.foto}`
        : "https://via.placeholder.com/400x300.png?text=Sushi";

      // Genera el HTML de las estrellas dinámicas
      const ratingHTML = generateRatingHTML(
        item.avg_rating,
        item.total_ratings,
        item.id
      );

      itemElement.innerHTML = `
                <img src="${imageUrl}" alt="${
        item.nombre
      }" class="h-48 w-full object-cover" loading="lazy">
                <div class="p-5">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg">${item.nombre}</h3>
                        <span class="text-red-600 font-bold text-lg">$${parseFloat(
                          item.precio
                        ).toFixed(2)}</span>
                    </div>
                    <p class="text-gray-600 mb-4">${item.descripcion}</p>
                    <div class="flex justify-between items-center">
                        ${ratingHTML} <button class="add-to-cart-btn bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">Añadir</button>
                    </div>
                </div>
            `;

      // *** AÑADIDO LISTENER PARA EL BOTÓN "AÑADIR" ***
      itemElement
        .querySelector(".add-to-cart-btn")
        .addEventListener("click", () => {
          addToCart(item); // 'item' ahora contiene 'id', 'avg_rating', etc.
          const btn = itemElement.querySelector(".add-to-cart-btn");
          btn.textContent = "¡Añadido!";
          setTimeout(() => {
            btn.textContent = "Añadir";
          }, 1000);
        });

      // *** AÑADIDO LISTENER PARA EL BOTÓN "CALIFICAR" ***
      const rateBtn = itemElement.querySelector(".rate-btn");
      rateBtn.dataset.name = item.nombre; // Añadimos el nombre para el modal
      rateBtn.addEventListener("click", () => {
        openRatingModal(item.id, item.nombre);
      });

      menuItemsContainer.appendChild(itemElement);
    });
  }

  async function fetchAndRenderMenu(category) {
    // ... (Función sin cambios, pero ahora recibirá los nuevos datos de calificación) ...
    menuItemsContainer.innerHTML =
      '<p class="text-center col-span-full">Cargando menú...</p>';
    try {
      const response = await fetch(`api/get_menu.php?category=${category}`);
      if (!response.ok) {
        throw new Error(
          `Error HTTP: ${response.status} ${response.statusText}`
        );
      }
      const items = await response.json();
      if (items.error) {
        throw new Error(items.error);
      }
      renderMenuItems(items);
    } catch (error) {
      console.error("Error al cargar el menú desde la API:", error);
      menuItemsContainer.innerHTML =
        '<p class="text-center text-red-500 col-span-full">Error al cargar el menú. Por favor, intente más tarde.</p>';
    }
  }

  function initMenu() {
    // ... (Función sin cambios) ...
    if (!menuItemsContainer) return;
    categoryButtons.forEach((button) => {
      button.addEventListener("click", function () {
        categoryButtons.forEach((btn) => {
          btn.classList.remove("active");
        });
        this.classList.add("active");
        const category = this.getAttribute("data-category");
        fetchAndRenderMenu(category);
      });
    });
    fetchAndRenderMenu("entradas");
  }

  initMenu();

  // --- Manejo de Formularios (Contacto) ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch("api/save_message.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok && result.success) {
          alert(
            "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto."
          );
          this.reset();
        } else {
          alert("Error: " + (result.error || "No se pudo enviar el mensaje."));
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        alert("Error de conexión. Por favor, intente más tarde.");
      }
    });
  }
});
