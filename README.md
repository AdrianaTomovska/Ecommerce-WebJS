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


## 📝 Notes
- Cart data is stored in browser's `localStorage`
- Cart persists across page reloads and browser sessions
- Products are fetched from [DummyJSON API](https://dummyjson.com)


## 📄 License
Free to use for educational purposes.
