# 🍔 Food Delivery Backend API

A robust backend API for a MERN stack food delivery application with secure authentication, payment integration, and admin management capabilities.

## 🌐 Live API Base URL
```
https://food-delivery-server-two.vercel.app/
```

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Models](#-models)
- [Environment Variables](#%EF%B8%8F-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Deployment](#-deployment)

## 🚀 Features
- **User Authentication** (JWT & Google OAuth)
- **Food Menu Management** (CRUD operations)
- **Shopping Cart** (Add/Remove/View items)
- **Order Management** (Place, Track, Update status)
- **Payment Integration** (SSLCommerz)
- **Admin Dashboard** (Analytics, Order management)
- **CORS Enabled** (Multi-origin support)
- **Secure Cookie Management**

## 🛠 Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT, Google OAuth
- **Payment Gateway**: SSLCommerz
- **CORS**: Cross-Origin Resource Sharing
- **Environment Management**: dotenv
- **Deployment**: Vercel

## 📊 API Endpoints

### 🍕 Food Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/food/food_list` | Get all food items | No |
| `POST` | `/food/add` | Add new food item | Admin Only |
| `DELETE` | `/food/remove/:id` | Remove food item | Admin Only |
| `POST` | `/food/remove/food_image` | Remove food image | Admin Only |

### 👥 User Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/user/register` | User registration | No |
| `POST` | `/user/login` | User login | No |
| `POST` | `/user/googleLogin` | Google OAuth login | No |
| `GET` | `/user/currentUser` | Get current user info | Yes |
| `GET` | `/user/logout` | User logout | Yes |

### 🛒 Cart Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/cart/add` | Add item to cart | Yes |
| `GET` | `/cart/get` | Get cart items | Yes |
| `POST` | `/cart/remove` | Remove item from cart | Yes |

### 📦 Order Routes
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/order/placeOrder` | Place new order | Yes |
| `POST` | `/order/verify` | Verify payment | No |
| `GET` | `/order/userOrder` | Get user orders | Yes |
| `GET` | `/order/orderList` | Get all orders (Admin) | Admin Only |
| `PUT` | `/order/:orderId/status` | Update order status | Admin Only |
| `GET` | `/order/analytics` | Get analytics | Admin Only |

### 🔄 Payment Callbacks (SSLCommerz)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET/POST` | `/order/sslcommerz/success` | Payment success callback |
| `GET/POST` | `/order/sslcommerz/fail` | Payment failure callback |
| `GET/POST` | `/order/sslcommerz/cancel` | Payment cancellation callback |

## 🔐 Authentication

### JWT Token
- Tokens are sent via HTTP-only cookies
- Required for protected routes
- Automatically refreshed

### Protected Routes
- Add `Authorization` header with Bearer token
- Or include token in cookies

### Admin Routes
- Require `role: "admin"` in user object
- Protected with `verifyAdmin` middleware

## 🗃 Models

### User Model
```javascript
{
  userName: String (required, unique),
  email: String (required, unique),
  password: String (optional),
  role: String (enum: ["user", "admin"]),
  googleId: String (unique, sparse),
  image: String,
  cartData: Object
}
```

### Food Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  image: String (required),
  category: String (required)
}
```

### Order Model
```javascript
{
  userId: String (required),
  items: Array (required),
  amount: Number (required),
  address: Object (required),
  status: String (enum: statuses),
  payment: Boolean,
  transactionId: String,
  paymentMethod: String,
  estimatedDelivery: Date
}
```

## ⚙️ Environment Variables

Create a `.env` file with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_pass=rH6UKlYk62XFhvQ5

# Client URLs
FRONTEND_URL=https://food-delivery-alpha-puce.vercel.app/
BACKEND_URL=http://localhost:5000

# Security
JWT_SECRET=7ea98d6ae842072821g66081dbcab784768b846
COOKIE_SECRET=a7ea98d6ae842072821f66081dbcab784768b846
COOKIE_NAME=learn_with_rakib
GOOGLE_CLIENT_ID=use your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=use your_google_oauth_client_secret

# Payment (SSLCommerz)
SSL_STORE_ID=foodd68c43d80cf0d1
SSL_STORE_PASS=foodd68c43d80cf0d1@ssl
SSL_IS_LIVE=false  
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd your-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configurations
   ```

4. **Start the development server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

### Scripts
```json
{
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

## 🌍 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Environment-specific Configuration
- **Development**: Uses local MongoDB
- **Production**: Uses cloud MongoDB with optimized settings

## 🔧 CORS Configuration

The API supports multiple origins:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Create React App)
- Custom domains via environment variables
