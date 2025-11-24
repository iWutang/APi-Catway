const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("../routes/authRoutes");
const catwayRoutes = require("../routes/catwayRoutes");
const reservationRoutes = require("../routes/reservationRoutes");

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connexion MongoDB
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch((err) => console.error("❌ Erreur MongoDB:", err));
}

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("✅ Connecté à MongoDB"))
//   .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Routes publiques
app.use("/", authRoutes);

// Routes protégées
app.use("/catways", catwayRoutes);
app.use("/reservations", reservationRoutes);

// app.listen(PORT, () => {
//   console.log(`🚢 Serveur démarré sur http://localhost:${PORT}`);
// });

module.exports = app;
