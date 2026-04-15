# Forex Trade Tracker (Client)

A React-based frontend application for tracking forex trades, managing trade history, and analysing trading performance.

This project is part of a full-stack Forex Trade Tracker system.  
This README covers only the **client-side (React)** implementation.

---

## 🚀 Features

- User Registration
- User Login (JWT-based authentication)
- Create new trades
- View all trades in a table
- Edit existing trades
- Delete trades
- Profit/Loss visual highlighting (green/red)
- Clean dashboard-style UI

---

## 🛠️ Tech Stack

- **Frontend:** React (JavaScript)
- **Styling:** Custom CSS (modular structure)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Authentication:** JWT (handled via backend)

---

## 📁 Project Structure
```
src/
│
├── components/
│ └── trades/
│ ├── ShowAllTrades.jsx
│ ├── TradeTable.jsx
│ ├── TradeRow.jsx
│ └── CreateTrade.jsx
│
├── pages/
│ ├── Register.jsx
│ ├── Login.jsx
│ ├── UserPage.jsx
│ └── AdminPage.jsx
│
├── styles/
│ ├── base/
│ │ ├── reset.css
│ │ ├── typography.css
│ │ └── variables.css
│ │
│ ├── components/
│ │ ├── auth.css
│ │ ├── button.css
│ │ ├── card.css
│ │ ├── form.css
│ │ ├── table.css
│ │ └── trade.css
│ │
│ ├── layout/
│ │ ├── app.css
│ │ ├── dashboard.css
│ │ └── page.css
│ │
│ └── main.css
│
├── App.js
└── index.js
```
---

## 🔐 Authentication Flow

- User logs in → receives JWT from backend
- Token is stored in `localStorage`
- Token is decoded using `jwt-decode`
- User session persists until token expires or logout

---

## 📊 Trade Features

Users can:

- Add new trades with:
  - Symbol
  - Direction (buy/sell)
  - Entry & Exit price
  - Volume
  - Profit/Loss
  - Strategy
  - Notes

- Edit trades inline
- Delete trades

### Visual Indicators

- 🟢 Profit trades
- 🔴 Loss trades
- ⚪ Breakeven trades

---

## 🎨 UI Design Approach

- Modular CSS structure (base, components, layout)
- Reusable components (table, form, card)
- Dashboard-style layout
- Minimal and clean design
- Focus on usability and clarity

---

## 📌 Notes

This is the **client-side only**.

Backend handles:

- Authentication
- Trade storage
- API endpoints

---

## 👤 Author

Amosh
