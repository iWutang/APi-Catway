const express = require("express");
const router = express.Router();

const authServices = require("../services/authService");

// Docs
router.get("/docs", (req, res) => {
  res.sendFile("docs.html");
});

// Inscription
router.post("/register", authServices.createUser);

// Connexion
router.post("/login", authServices.loginUser);

module.exports = router;
