import { Product } from "./models/Product.js";
import { addToCart, updateCartBadge } from "./utils/cart.js";

// HTML references
const html = {
  cardContainer: document.querySelector("#resultContainer .row"),
  pagination: document.querySelector(".pagination"),
  gridViewBtn: document.getElementById("gridViewBtn"),
  listViewBtn: document.getElementById("listViewBtn"),
  priceLowHigh: document.getElementById("priceLowHigh"),
  priceHighLow: document.getElementById("priceHighLow"),
  spinner: document.getElementById("spinner"),
  categoryContainer: document.getElementById("categoryFilters"),
};

// App state
const state = {
  products: [],
  totalProducts: 0,
  currentPage: 1,
  limit: 12,
  selectedCategories: [],
  sortByPrice: null,
  view: "grid",
};

// Helpers
async function getData(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return await res.json();
}

function toggleSpinner(show) {
  if (!html.spinner) return;
  html.spinner.classList.toggle("d-none", !show);
}

// Fetch products
async function fetchProducts({ limit = state.limit, skip = 0, category = "" } = {}) {
  const url = category
    ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`
    : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

  const data = await getData(url);
  let products = data.products;

  if (state.sortByPrice === "asc") products.sort((a, b) => a.price - b.price);
  if (state.sortByPrice === "desc") products.sort((a, b) => b.price - a.price);

  return { products, total: data.total };
}

// Load & render products
async function loadProducts(page = 1) {
  try {
    toggleSpinner(true);
    state.currentPage = page;
    const skip = (page - 1) * state.limit;

    let products = [];
    let total = 0;

    if (state.selectedCategories.length > 0) {
      const requests = state.selectedCategories.map(cat => fetchProducts({ limit: 100, skip: 0, category: cat }));
      const results = await Promise.all(requests);
      products = results.flatMap(r => r.products);
      total = products.length;
      products = products.slice(skip, skip + state.limit);
    } else {
      const { products: apiProducts, total: apiTotal } = await fetchProducts({ limit: state.limit, skip });
      products = apiProducts;
      total = apiTotal;
    }

    state.products = products;
    state.totalProducts = total;

    renderProducts();
    renderPagination();
  } catch (err) {
    console.error("Error loading products:", err);
  } finally {
    toggleSpinner(false);
  }
}

// Render products
function renderProducts() {
  if (!html.cardContainer) return;

  html.cardContainer.innerHTML = state.products.map(p => createCard(p)).join("");
  html.cardContainer.parentElement.classList.toggle("grid-view", state.view === "grid");
  html.cardContainer.parentElement.classList.toggle("list-view", state.view === "list");
}

function createCard(product) {
  const isList = state.view === "list";
  return `
    <div class="${isList ? 'mb-3' : 'col-12 col-sm-6 col-md-4 col-lg-3 mb-3 d-flex'}">
      <div class="card d-flex flex-column h-100">
        <div class="d-flex justify-content-center align-items-center bg-light" style="height:200px; overflow:hidden;">
          <img src="${product.thumbnail}" alt="${product.title}" class="img-fluid" style="object-fit:contain; max-height:100%; max-width:100%;">
        </div>
        <div class="card-body d-flex flex-column flex-grow-1">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text flex-grow-1">${product.description}</p>
          <p class="fw-bold text-success">$${product.price}</p>
          <button class="btn btn-success mt-auto add-to-cart"
            data-id="${product.id}"
            data-title="${product.title}"
            data-price="${product.price}"
            data-image="${product.thumbnail}"
            data-stock="${product.stock}">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// Pagination
function renderPagination() {
  if (!html.pagination) return;
  const totalPages = Math.ceil(state.totalProducts / state.limit);
  let htmlPages = "";

  htmlPages += `<li class="page-item ${state.currentPage === 1 ? "disabled" : ""}">
    <a class="page-link" data-page="prev">Previous</a></li>`;

  const start = Math.max(1, state.currentPage - 2);
  const end = Math.min(totalPages, state.currentPage + 2);

  if (start > 1) {
    htmlPages += `<li class="page-item"><a class="page-link" data-page="1">1</a></li>`;
    if (start > 2) htmlPages += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
  }

  for (let i = start; i <= end; i++) {
    htmlPages += `<li class="page-item ${state.currentPage === i ? "active" : ""}">
      <a class="page-link" data-page="${i}">${i}</a></li>`;
  }

  if (end < totalPages) {
    if (end < totalPages - 1) htmlPages += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    htmlPages += `<li class="page-item"><a class="page-link" data-page="${totalPages}">${totalPages}</a></li>`;
  }

  htmlPages += `<li class="page-item ${state.currentPage === totalPages ? "disabled" : ""}">
    <a class="page-link" data-page="next">Next</a></li>`;

  html.pagination.innerHTML = htmlPages;
}

// Load categories
async function loadCategories() {
  if (!html.categoryContainer) return;
  const data = await getData("https://dummyjson.com/products/category-list");
  if (!data || !data.length) return;

  html.categoryContainer.innerHTML = "";
  data.forEach(cat => {
    const div = document.createElement("div");
    div.classList.add("form-check");

    const input = document.createElement("input");
    input.type = "checkbox";
    input.classList.add("form-check-input");
    input.value = cat;
    input.id = "cat-" + cat.replace(/\s+/g, "-");

    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.htmlFor = input.id;
    label.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);

    div.append(input, label);
    html.categoryContainer.appendChild(div);

    input.addEventListener("change", () => {
      state.selectedCategories = Array.from(html.categoryContainer.querySelectorAll("input:checked")).map(i => i.value);
      loadProducts(1);
    });
  });
}

// Event delegation
document.addEventListener("click", e => {
  if (e.target.classList.contains("page-link")) {
    const page = e.target.dataset.page;
    const totalPages = Math.ceil(state.totalProducts / state.limit);
    if (page === "prev" && state.currentPage > 1) loadProducts(state.currentPage - 1);
    else if (page === "next" && state.currentPage < totalPages) loadProducts(state.currentPage + 1);
    else if (!isNaN(page)) loadProducts(Number(page));
  }

  if (e.target.classList.contains("add-to-cart")) {
    const product = new Product({
      id: Number(e.target.dataset.id),
      title: e.target.dataset.title,
      description: "Product from MyShop",
      category: "Products",
      price: Number(e.target.dataset.price),
      stock: Number(e.target.dataset.stock),
      thumbnail: e.target.dataset.image
    });
    addToCart(product);
  }
});

// View toggle & sorting
if (html.gridViewBtn) html.gridViewBtn.addEventListener("click", () => { state.view = "grid"; loadProducts(state.currentPage); });
if (html.listViewBtn) html.listViewBtn.addEventListener("click", () => { state.view = "list"; loadProducts(state.currentPage); });

if (html.priceLowHigh) html.priceLowHigh.addEventListener("click", () => {
  state.sortByPrice = "asc";
  html.priceLowHigh.classList.add("active");
  html.priceHighLow.classList.remove("active");
  loadProducts(1);
});
if (html.priceHighLow) html.priceHighLow.addEventListener("click", () => {
  state.sortByPrice = "desc";
  html.priceHighLow.classList.add("active");
  html.priceLowHigh.classList.remove("active");
  loadProducts(1);
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProducts();
  updateCartBadge();
});