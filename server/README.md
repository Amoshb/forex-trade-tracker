# Forex Trade Tracker (Server)

A Node.js and Express backend for handling user authentication, trade management, and protected API routes for the Forex Trade Tracker project.

This README covers only the **server-side** of the application.

---

## 🚀 Features

- User registration
- User login
- Password hashing with bcrypt
- JWT-based authentication
- Protected trade routes
- Create new trades
- Get all trades
- Update existing trades
- Delete trades
- MongoDB database integration with Mongoose

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Hashing:** bcrypt / bcryptjs
- **Environment Variables:** dotenv
- **Development Tool:** nodemon

---

## 📁 Project Structure

server/
│
├── Controller/
│ ├── auth-controller.js
│ └── trade-controller.js
│
├── Database/
│ └── db.js
│
├── Middleware/
│ ├── admin-middleware.js
│ └── auth-middleware.js
│
├── Model/
│ ├── trade.js
│ └── user.js
│
├── Route/
│ ├── admin-routes.js
│ ├── auth-routes.js
│ └── trade-routes.js
│
├── .env
├── package.json
├── package-lock.json
└── server.js

---

## 🔐 Authentication

The backend uses **JWT authentication** to protect trade-related routes.

### Auth Routes

- `POST /register` — Register a new user
- `POST /login` — Login user and return JWT

### Protected Trade Routes

These routes require a valid JWT token:

- `POST /create` — Create a new trade
- `GET /all_trades` — Get all trades for the authenticated user
- `PUT /update/:id` — Update a trade
- `DELETE /delete/:id` — Delete a trade

---

## 📊 Trade Data

Each trade can store information such as:

- Symbol
- Direction
- Open price
- Close price
- Volume
- Profit/Loss
- Strategy
- Notes

This allows the frontend to display trade history, edit trades, delete trades, and analyse performance.

---

## 🌐 API Purpose

This backend is designed to support the Forex Trade Tracker frontend by:

- managing authentication
- securing protected routes
- storing and retrieving trade data
- handling trade updates and deletion

---

## 🔑 Environment Variables

The server uses environment variables through `.env`.

Typical variables include:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`

---

## 📌 Notes

- This is the **server-side only**
- The frontend is built separately using React
- Some project features are still in progress
- Deployment and production setup can be added later

---

## 👤 Author

Amosh

```

```
