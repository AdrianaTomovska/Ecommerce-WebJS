// cart.js

// Get the current cart from localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save the cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add a product to the cart
export function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(p => p.id === product.id);

  // Ensure stock is valid
  if (typeof product.stock !== "number" || isNaN(product.stock)) {
    product.stock = 1;
  }

  if (existing) {
    // Increase quantity if under stock limit
    if (existing.quantity < existing.stock) {
      existing.quantity++;
    } else {
      alert(`Maximum available is ${existing.stock} of ${existing.title}.`);
    }
  } else {
    // Add new product with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
}

// Change the quantity of a product in the cart
export function changeQuantity(id, delta) {
  let cart = getCart();

  cart = cart.map(p => {
    if (String(p.id) === String(id)) {
      const newQuantity = p.quantity + delta;

      if (newQuantity > p.stock) {
        alert(`Maximum available is ${p.stock} of ${p.title}.`);
      } else if (newQuantity <= 0) {
        p.quantity = 0; // will be removed later
      } else {
        p.quantity = newQuantity;
      }
    }
    return p;
  });

  // Remove products with quantity 0
  cart = cart.filter(p => p.quantity > 0);

  saveCart(cart);
}

// Remove a product from the cart entirely
export function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(p => String(p.id) !== String(id));
  saveCart(cart);
}

// Update the cart badge (number of unique products)
export function updateCartBadge() {
  const cart = getCart();
  const badge = document.getElementById("cart-badge");

  const totalItems = cart.length; // count unique items only

  if (badge) badge.textContent = totalItems;
}

// Get total quantity of all items in the cart
export function getTotalQuantity() {
  const cart = getCart();
  return cart.reduce((sum, p) => sum + p.quantity, 0);
}

// Clear the entire cart
export function clearCart() {
  localStorage.removeItem("cart");
  updateCartBadge();

  // Show checkout toast
  const toastEl = document.getElementById("checkoutToast");
  if (toastEl) {
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
}
