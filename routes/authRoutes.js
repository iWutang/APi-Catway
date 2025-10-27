const express = require("express");
const router = express.Router();

const authService = require("../services/authService");

// Docs
router.get("/docs", (req, res) => {
  res.sendFile("docs.html");
});

// Inscription
router.post("/register", authService.createUser);

// Connexion
router.post("/login", authService.loginUser);

module.exports = router;
