import { getCart, changeQuantity, removeFromCart, updateCartBadge, clearCart } from "./utils/cart.js";

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

  let html = `<table class="table"><thead><tr>
    <th>Image</th><th>Title</th><th>Price</th><th>Quantity</th><th>Action</th>
  </tr></thead><tbody>`;

  let total = 0, totalQty = 0;
  cart.forEach(p => {
    total += p.price * p.quantity;
    totalQty += p.quantity;
    const img = p.thumbnail || p.image || "https://via.placeholder.com/50";

    html += `<tr data-id="${p.id}">
      <td><img src="${img}" width="50"></td>
      <td>${p.title}</td>
      <td>$${p.price}</td>
      <td>
        <button class="btn btn-sm btn-outline-secondary qty-btn" data-id="${p.id}" data-delta="-1">-</button>
        <span id="qty-${p.id}" class="mx-2">${p.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary qty-btn" data-id="${p.id}" data-delta="1">+</button>
      </td>
      <td><button class="btn btn-sm btn-danger remove-btn" data-id="${p.id}">Remove</button></td>
    </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  const shipping = total > 50 ? 0 : totalQty * 2;
  document.getElementById("cartQuantity").textContent = totalQty;
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("cartShipping").textContent = `$${shipping.toFixed(2)}`;
  updateCartBadge();
}

// --- Event delegation to prevent full rerender ---
document.getElementById("cartContainer")?.addEventListener("click", (e) => {
  const btn = e.target.closest(".qty-btn");
  if (btn) {
    const id = Number(btn.dataset.id);
    const delta = Number(btn.dataset.delta);
    changeQuantity(id, delta);
    const qtyEl = document.getElementById(`qty-${id}`);
    const product = getCart().find(p => p.id === id);
    if (qtyEl && product) qtyEl.textContent = product.quantity;
    renderSummary();
  }

  const removeBtn = e.target.closest(".remove-btn");
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    removeFromCart(id);
    renderCart();
  }
});

// --- Only update totals ---
function renderSummary() {
  const cart = getCart();
  let total = 0, totalQty = 0;
  cart.forEach(p => {
    total += p.price * p.quantity;
    totalQty += p.quantity;
  });
  const shipping = total > 50 ? 0 : totalQty * 2;
  document.getElementById("cartQuantity").textContent = totalQty;
  document.getElementById("cartTotal").textContent = `$${total.toFixed(2)}`;
  document.getElementById("cartShipping").textContent = `$${shipping.toFixed(2)}`;
  updateCartBadge();
}

// --- Checkout modal ---
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  const checkoutBtn = document.getElementById("checkoutBtn");
  const checkoutModal = new bootstrap.Modal(document.getElementById("checkoutModal"));

  checkoutBtn?.addEventListener("click", () => checkoutModal.show());
  document.getElementById("checkoutYes")?.addEventListener("click", () => {
    clearCart();
    renderCart();
    checkoutModal.hide();
  });
  document.getElementById("checkoutNo")?.addEventListener("click", () => checkoutModal.hide());
});