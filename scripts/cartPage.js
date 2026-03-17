import { getCart, changeQuantity, removeFromCart, updateCartBadge } from "./utils/cart.js";

// Clear the entire cart
function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
  updateCartBadge();

  // show toast notification
  const toastEl = document.getElementById("checkoutToast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

// Render the cart table and update totals
function renderCart() {
  const cart = getCart();
  const container = document.getElementById("cartContainer");

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cartQuantity").textContent = 0;
    document.getElementById("cartTotal").textContent = "$0.00";
    document.getElementById("cartShipping").textContent = "$0.00";
    updateCartBadge();
    return;
  }

  let html = `
    <table class="table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  let totalQty = 0;

  cart.forEach(p => {
    total += p.price * p.quantity;
    totalQty += p.quantity;

    const imgSrc = p.thumbnail || p.image || "https://via.placeholder.com/50";

    html += `
      <tr>
        <td><img src="${imgSrc}" width="50" alt="${p.title}"></td>
        <td>${p.title}</td>
        <td>$${p.price}</td>
        <td>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${p.id}, -1)">-</button>
          <span id="qty-${p.id}" class="mx-2">${p.quantity}</span>
          <button class="btn btn-sm btn-outline-secondary" onclick="changeQuantity(${p.id}, 1)">+</button>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeFromCart(${p.id}); renderCart(); updateCartBadge();">Remove</button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  // Dynamically calculate shipping
  // Rule: $2 per item, free shipping if total > $50
  const shippingCost = total > 50 ? 0 : totalQty * 2;

  // Update cart totals and shipping
  document.getElementById("cartQuantity").textContent = totalQty;
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("cartShipping").textContent = `$${shippingCost.toFixed(2)}`;

  // Update the cart badge in the UI
  updateCartBadge();
}

// Update cart and badge on quantity change
window.changeQuantity = (id, delta) => {
  changeQuantity(id, delta);
  renderCart();
  updateCartBadge();
};

// Remove product from cart and update badge
window.removeFromCart = (id) => {
  removeFromCart(id);
  renderCart();
  updateCartBadge();
};

// DOMContentLoaded listener to initialize cart and checkout modal
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      checkoutModal.show();
    });
  }

  // Confirm checkout → clear cart and hide modal
  document.getElementById("checkoutYes").addEventListener("click", () => {
    clearCart();
    checkoutModal.hide();
  });

  // Cancel checkout → hide modal
  document.getElementById("checkoutNo").addEventListener("click", () => {
    checkoutModal.hide();
  });
});
