# Forex Trade Tracker (Server)

This is the backend REST API for the Forex Trade Tracker application. It handles user authentication, protected routes, trade CRUD operations, analytics aggregation, and admin user management.

The server is built with Node.js, Express, MongoDB, Mongoose, JWT authentication, and bcrypt password hashing.

## ⚙️ Setup

**Prerequisites:** Node.js 18+, MongoDB (local or Atlas URI)

**Install**

```bash
cd server
npm install
```

**Run**

```bash
npm run dev   # nodemon (auto-restart on file change)
npm start     # node (production)
```

Server starts on `PORT` (default: 5000).

## 🔐 Environment Variables

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_super_secret_key_here
```

| Variable         | Description                 | Example                                                           |
| ---------------- | --------------------------- | ----------------------------------------------------------------- |
| `PORT`           | Port the server runs on     | `5000`                                                            |
| `MONGO_URI`      | MongoDB connection string   | `mongodb+srv://...` (Atlas) or `mongodb://localhost:27017/dbname` |
| `JWT_SECRET_KEY` | Secret key for signing JWTs | Any long random string                                            |

## 🏗️ Backend Architecture

```text
Client Request
      ↓
Express Routes
      ↓
Middleware (Auth/Admin)
      ↓
Controllers
      ↓
MongoDB via Mongoose
```

## 📘 API Reference

Base URL: `http://localhost:5000`

All protected routes require header: `Authorization: Bearer <token>`

---

### Auth — `/api/auth`

| Method | Endpoint    | Auth | Description         |
| ------ | ----------- | ---- | ------------------- |
| POST   | `/register` | No   | Register a new user |
| POST   | `/login`    | No   | Login, returns JWT  |

**POST /register**

```json
// Body
{ "username": "trader1", "password": "securepassword" }

// Response 201
{ "message": "User registered successfully" }
```

**POST /login**

```json
// Body
{ "username": "trader1", "password": "securepassword" }

// Response 200
{ "token": "<jwt>" }
```

---

### Trades — `/api/trades`

All routes require authentication.

| Method | Endpoint               | Description                                 |
| ------ | ---------------------- | ------------------------------------------- |
| POST   | `/create`              | Create a new trade                          |
| GET    | `/all_trades`          | Get all trades (no pagination)              |
| GET    | `/all_trade_paginated` | Get trades with pagination + filters        |
| GET    | `/filter-options`      | Get available filter values (symbols, etc.) |
| PUT    | `/update/:id`          | Update a trade by ID                        |
| DELETE | `/delete/:id`          | Delete a trade by ID                        |
| GET    | `/total_win_and_loss`  | Aggregate win/loss/breakeven counts + %     |
| GET    | `/trade_stats`         | Grouped trade analytics                     |

**POST /create — Body:**

```json
{
  "symbol": "EURUSD",
  "direction": "buy",
  "volume": 0.1,
  "openPrice": 1.085,
  "closePrice": 1.09,
  "stopLoss": 1.082,
  "takeProfit": 1.092,
  "profitLoss": 50,
  "strategy": "breakout",
  "notes": "Strong momentum"
}
```

**GET /all_trade_paginated — Query params:**

```
?page=1&limit=10&symbol=EURUSD&direction=buy&strategy=Breakout
```

**GET /trade_stats — Query params:**

```
?groupBy=strategy
?groupBy=symbol
?groupBy=direction
?groupBy=strategy,direction   ← supports multiple fields
```

---

### Admin — `/api/admin`

All admin routes require authentication and admin authorization.

| Method | Endpoint                  | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/users`                  | Get all users                      |
| GET    | `/users/:id`              | Get a single user by ID            |
| DELETE | `/delete-user/:id`        | Delete a user and all their trades |
| GET    | `/user-stats`             | Aggregate user statistics          |
| GET    | `/users-with-trade-count` | Get users with their trade counts  |
| PUT    | `/update-user-role/:id`   | Update a user's role (user/admin)  |

## 🗂️ Data Models

### Trade

| Field        | Type     | Required | Notes                      |
| ------------ | -------- | -------- | -------------------------- |
| `userId`     | ObjectId | Yes      | Reference to User          |
| `symbol`     | String   | Yes      | e.g. "EURUSD" (uppercased) |
| `direction`  | String   | Yes      | `"buy"` or `"sell"`        |
| `volume`     | Number   | Yes      |                            |
| `openPrice`  | Number   | Yes      |                            |
| `closePrice` | Number   | Yes      |                            |
| `stopLoss`   | Number   | No       |                            |
| `takeProfit` | Number   | No       |                            |
| `profitLoss` | Number   | Yes      | Negative = loss            |
| `strategy`   | String   | Yes      | Title-cased on save        |
| `notes`      | String   | No       |                            |
| `createdAt`  | Date     | Auto     | Mongoose timestamp         |
| `updatedAt`  | Date     | Auto     | Mongoose timestamp         |

### User

| Field      | Type   | Required | Notes                           |
| ---------- | ------ | -------- | ------------------------------- |
| `username` | String | Yes      | Unique                          |
| `password` | String | Yes      | bcrypt hashed                   |
| `role`     | String | Auto     | `"user"` (default) or `"admin"` |

## ⚙️ Middleware

- **`auth-middleware.js`** — Validates JWT from `Authorization` header. Attaches `req.userInfo` (`{ userID, username, role }`) on success. Returns 401 if missing/invalid/expired.
- **`admin-middleware.js`** — Checks `req.userInfo.role === "admin"`. Returns 403 if not admin. Must be used after `auth-middleware`.

## 📁 Project Structure

```
server/
├── Controller/
│   ├── Trade/
│   │   ├── trade-crud.js       # CRUD + pagination + filter options
│   │   └── trade-analysis.js   # Win/loss aggregation, grouped stats
│   ├── admin/
│   │   ├── user-info.js        # Get, delete, update users
│   │   └── user-analysis.js    # User stats, trade counts
│   └── auth-controller.js      # Register, login
├── Database/
│   └── db.js                   # Mongoose connection
├── Middleware/
│   ├── auth-middleware.js       # JWT validation
│   └── admin-middleware.js      # Role check
├── Model/
│   ├── trade.js                 # Trade schema
│   └── user.js                  # User schema
├── Route/
│   ├── auth-routes.js
│   ├── trade-routes.js
│   └── admin-routes.js
├── server.js                    # Entry point, CORS, route mounting
└── package.json
```

## 📊 Analytics Features

MongoDB aggregation pipelines are used to generate:

- Win/loss statistics
- Strategy performance analysis
- Trade distribution insights
- User activity analytics
- Dashboard summary metrics

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Role-based authorization
- Environment variable protection

## ⚠️ Error Handling

The API returns appropriate HTTP status codes and JSON error responses for:

- Authentication failures
- Unauthorized access
- Validation errors
- Missing resources
- Server errors

## 👤 Author

Amosh Balami

- GitHub: https://github.com/Amoshb
