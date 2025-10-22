document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalElement = document.getElementById("cart-total");
  const emptyCartMessage = document.getElementById("empty-cart-message");
  const clearCartBtn = document.getElementById("clear-cart-btn");
  const cartCountElement = document.getElementById("cart-count");
  const cartLinkContainer = document.getElementById("cart-link-container");

  let cart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

  const popover = new bootstrap.Popover(cartLinkContainer, {
    container: "body",
    html: true,
    placement: "bottom",
    trigger: "hover focus",
    title: "Your Cart",
    content: "Your cart is empty.",
  });

  function generatePopoverContent() {
    if (cart.length === 0) {
      return "<p class='p-2'>Your cart is empty.</p>";
    }
    let content = '<div class="list-group list-group-flush">';
    let total = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      content += `<div class="list-group-item d-flex justify-content-between align-items-center text-sm"><span>${
        item.name
      } x${item.quantity}</span> <span>$${itemTotal.toFixed(2)}</span></div>`;
    });
    content += `<div class="list-group-item d-flex justify-content-between align-items-center fw-bold"><span>Total</span> <span>$${total.toFixed(
      2
    )}</span></div>`;
    content += "</div>";
    return content;
  }

  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
      cartCountElement.textContent = totalItems;
      cartCountElement.style.display = totalItems > 0 ? "inline-block" : "none";
    }
    popover.setContent({
      ".popover-body": generatePopoverContent(),
    });
  }

  function renderCart() {
    cartItemsContainer.innerHTML = ""; // Clear previous items
    let total = 0;

    if (cart.length === 0) {
      emptyCartMessage.style.display = "block";
      cartTotalElement.textContent = "$0.00";
      clearCartBtn.style.display = "none";
      return;
    } else {
      emptyCartMessage.style.display = "none";
      clearCartBtn.style.display = "inline-block";
    }

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const cartItemDiv = document.createElement("div");
      cartItemDiv.className = "flex items-center border-b border-gray-200 py-2";
      cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${
        item.name
      }" class="w-16 h-16 object-cover rounded-md mr-4">
                <div class="flex-grow">
                    <h3 class="font-bold text-gray-800">${item.name}</h3>
                    <p class="text-gray-600">$${item.price.toFixed(2)} x ${
        item.quantity
      }</p>
                </div>
                <div class="text-right">
                    <p class="font-bold text-gray-800">$${itemTotal.toFixed(
                      2
                    )}</p>
                    <button class="btn btn-sm btn-danger remove-item-btn" data-product-id="${
                      item.id
                    }">Remove</button>
                </div>
            `;
      cartItemsContainer.appendChild(cartItemDiv);
    });

    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    updateCartCount();
  }

  function removeItem(productId) {
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    renderCart();
  }

  // Event listener for remove buttons
  cartItemsContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item-btn")) {
      const productId = event.target.dataset.productId;
      removeItem(productId);
    }
  });

  // Event listener for clear cart button
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("shoppingCart");
    renderCart();
  });

  renderCart(); // Initial render
});
