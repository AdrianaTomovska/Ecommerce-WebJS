# 🛒 MyShop E-Commerce

Simple e-commerce web application built with vanilla JavaScript, Bootstrap, and the DummyJSON API.

## 🚀 Features
- Browse products from DummyJSON API
- Add products to cart (stored in localStorage)
- Filter by category and price
- Grid/List view toggle
- Responsive design with Bootstrap

## 📋 Prerequisites
- A modern web browser
- **Local server** (required for JavaScript modules to work)

## 💻 How to Run Locally

### Option 1: Using Python
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

### Option 2: Using Node.js (Live Server)
```bash
npx http-server -p 8000
# or
npm install -g live-server
live-server
```

Then open: `http://localhost:8000`

### Option 3: VS Code Live Server Extension
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## 📁 File Structure
```
Ecommerce-WebJS/
├── index.html              # Main shopping page
├── cart.html               # Shopping cart page
├── scripts/
│   ├── app.js             # Main application logic
│   ├── cartPage.js        # Cart page functionality
│   ├── models/
│   │   └── Product.js     # Product class
│   └── utils/
│       └── cart.js        # Cart management (localStorage)
└── styles/
    ├── style-index.css    # Home page styles
    └── style-cart.css     # Cart page styles
```

## 🔧 GitHub Pages Setup
1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Select **main** branch as source
4. Your site will be live at: `https://your-username.github.io/Ecommerce-WebJS/`

## 📝 Notes
- Cart data is stored in browser's `localStorage`
- Cart persists across page reloads and browser sessions
- Products are fetched from [DummyJSON API](https://dummyjson.com)

## ⚠️ Important!
**Do NOT open HTML files directly** (file://). Always use a local server, otherwise JavaScript modules won't load.

## 📄 License
Free to use for educational purposes.
