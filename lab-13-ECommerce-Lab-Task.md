# Lab # 12

## Lab Task: Develop an Open-Ended Full-Stack Project Using the Learned Frontend and Backend Technologies

# Full-Stack E-Commerce Web Application

## 1. Introduction & Website Overview

Amazon.com is one of the world’s largest e-commerce platforms. It allows sellers to list products and customers to browse, search, add items to a cart, and place orders. In this lab task, you will build a simplified version of Amazon using the full-stack technologies you have learned.

> **Why Amazon?**  
> Amazon is an excellent reference because it demonstrates nearly every full-stack concept in one place: product listings (Read), adding products (Create), updating stock (Update), removing listings (Delete), user authentication, search/filtering, and a shopping cart with checkout flow.

| Field | Details |
|---|---|
| **Lab Task Title** | Full-Stack E-Commerce Web Application (Amazon Clone) |
| **Reference Site** | <https://www.amazon.com> |
| **Duration** | 3 Lab Sessions (3 hours each) |
| **Team Size** | 1 – 2 Students |
| **Technology Stack** | React (Frontend) + Node.js/Express (Backend) + MongoDB (Database) |
| **Submission** | GitHub Repository + Live Demo + Written Report |
| **Total Marks** | 100 Marks |

### 1.1 Core Features of Amazon (Reference)

Study the following features on Amazon before starting your implementation:

- Product listing page with images, titles, prices, and star ratings
- Product detail page with description, stock status, and Add to Cart button
- Shopping cart showing selected items, quantities, and subtotal
- User registration and login (email + password)
- Search bar that filters products by keyword
- Admin panel to add, edit, and delete products

### 1.2 Your Scope (Simplified Clone)

You are **not** required to replicate Amazon exactly. Your application must implement the core shopping flow listed below. Additional features earn bonus marks.

> **Minimum Viable Product (MVP)**  
> A visitor must be able to: (1) browse a list of products, (2) view a single product’s details, (3) register and log in, (4) add products to a cart, and (5) view their cart with a total price. An admin must be able to add, edit, and delete products.

## 2. Database Design

Design your MongoDB collections before writing any code. Below are the required schemas. You may add extra fields but must not remove the required ones.

### 2.1 Product Schema

```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});
```

### 2.2 User Schema

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed (bcrypt)
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});
```

### 2.3 Order Schema

```javascript
// models/Order.js
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true } // price at time of order
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});
```

## 3. Required API Endpoints

Implement and test **all** of the following REST endpoints using Postman before connecting the React frontend.

### 3.1 Product Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Return all products; supports `?category=` and `?search=` query parameters |
| GET | `/api/products/:id` | Return a single product by ID |
| POST | `/api/products` | Admin only — add a new product |
| PUT | `/api/products/:id` | Admin only — update product details or stock |
| DELETE | `/api/products/:id` | Admin only — remove a product listing |

### 3.2 Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user; hash password with bcrypt; return JWT |
| POST | `/api/auth/login` | Validate credentials; return JWT token on success |
| GET | `/api/auth/me` | Protected — return logged-in user’s profile; requires JWT header |

### 3.3 Order Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place a new order; protected — logged-in users only |
| GET | `/api/orders/my` | Return all orders for the logged-in user |
| GET | `/api/orders` | Admin only — return all orders in the system |
| PUT | `/api/orders/:id` | Admin only — update order status |

## 4. Frontend Tasks (React)

Build the following pages/components in React. Each page must fetch data from your Express API and handle loading and error states.

### 4.1 Pages to Build

| Page / Component | Route | Key Functionality |
|---|---|---|
| Home / Product Listing | `/` | Grid of product cards with image, name, price, rating. Search bar filters results. |
| Product Detail | `/products/:id` | Full product info, stock indicator, quantity selector, Add to Cart button. |
| Shopping Cart | `/cart` | List of cart items, quantity controls, remove button, subtotal, Place Order button. |
| Register | `/register` | Form: name, email, password, confirm password. Validates inputs before submitting. |
| Login | `/login` | Email + password form. Stores JWT in localStorage. Redirects to home on success. |
| Order History | `/orders` | Protected page — shows the user’s past orders with status badges. |
| Admin Dashboard | `/admin` | Protected admin-role page — table of all products with Edit and Delete buttons. |
| Add / Edit Product | `/admin/product` | Form to create or update a product. Validates all required fields. |

### 4.2 Shared Components

- **Navbar** — logo, search bar, cart icon with item count badge, login/logout button
- **ProductCard** — reusable card showing image, name, price, and star rating
- **ProtectedRoute** — wrapper that redirects unauthenticated users to `/login`
- **LoadingSpinner** — shown during all async API calls
- **ErrorMessage** — styled error display for failed requests
- **StarRating** — visual 1–5 star display component

### 4.3 State Management Requirements

You must manage the following state in your application. You may use React Context API or a simple global state approach:

- **Auth state** — currently logged-in user and JWT token
- **Cart state** — array of `{ product, quantity }` objects, persisted in `localStorage`
- **Product list state** — fetched from API and filtered by search term or category

```javascript
// Example: Cart Context
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      const updated = existing
        ? prev.map(i => i.product._id === product._id
          ? { ...i, quantity: i.quantity + qty }
          : i)
        : [...prev, { product, quantity: qty }];

      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}
```

## 5. Step-by-Step Implementation Guide

### Session 1 — Setup & Database

1. Initialise the backend: `npm init`; install `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, and `jsonwebtoken`.
2. Set up `.env` with `PORT`, `MONGO_URI`, and `JWT_SECRET`.
3. Create Mongoose models: `Product`, `User`, and `Order`.
4. Write a seed script to insert at least 10 sample products into MongoDB.
5. Test the database connection and confirm documents appear in MongoDB Compass or Atlas.

### Session 2 — Backend API

6. Implement product routes: `GET` all with search/filter, `GET` one, `POST`, `PUT`, and `DELETE`.
7. Implement auth routes: register with bcrypt hashing and login returning JWT.
8. Create a middleware function that verifies JWT and attaches user to `req.user`.
9. Protect `POST`, `PUT`, and `DELETE` product routes with admin middleware.
10. Implement order routes: place order, get my orders, admin get all, update status.
11. Test every route in Postman — screenshot each successful response for your report.

### Session 3 — Frontend & Integration

12. Initialise React app with Vite; install `axios` and `react-router-dom`.
13. Set up React Router with all required routes. See Section 4.1.
14. Build `AuthContext` for login state and `CartContext` for cart state.
15. Build the Home page: fetch products, display in a grid, implement search.
16. Build the Product Detail page with Add to Cart functionality.
17. Build the Cart page with quantity controls and total calculation.
18. Build Register and Login forms with JWT storage.
19. Build the Admin Dashboard with product management: add, edit, delete.
20. Build Order History page as a protected route.
21. Test the complete flow end-to-end and fix any integration bugs.
