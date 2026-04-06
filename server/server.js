require("dotenv").config();
const express = require("express");
const connectToDB = require("./Database/db");
const authRoutes = require("./Route/auth-routes");
const adminRoutes = require("./Route/admin-routes");
const tradeRoutes = require("./Route/trade-routes");

const app = express();
const PORT = process.env.PORT || 5000;
connectToDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trades", tradeRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
