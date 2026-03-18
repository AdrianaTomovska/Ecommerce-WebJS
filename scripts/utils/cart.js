
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (!product.stock) product.stock = 1;

  if (existing) {
    if (existing.quantity < existing.stock) existing.quantity++;
    else alert(`Maximum available is ${existing.stock} of ${existing.title}.`);
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
}

export function changeQuantity(id, delta) {
  let cart = getCart();
  cart = cart.map(p => {
    if (p.id === id || String(p.id) === String(id)) {
      const newQty = p.quantity + delta;
      if (newQty > p.stock) alert(`Max ${p.stock} of ${p.title}`);
      else if (newQty <= 0) p.quantity = 0;
      else p.quantity = newQty;
    }
    return p;
  }).filter(p => p.quantity > 0);
  saveCart(cart);
  updateCartBadge();
}

export function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(p => String(p.id) !== String(id));
  saveCart(cart);
  updateCartBadge();
}

// --- Update cart badge ---
export const updateCartBadge = () => {
  const badge = document.getElementById("cart-badge");
  if (badge) {
    const cart = getCart();
    badge.textContent = cart.length;
  }
};

export function clearCart() {
  localStorage.removeItem("cart");
  updateCartBadge();
  const toastEl = document.getElementById("checkoutToast");
  if (toastEl) new bootstrap.Toast(toastEl).show();
}