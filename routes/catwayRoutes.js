const express = require("express");
const router = express.Router();

const catwayService = require("../services/catwayService");

const authenticateToken = require("../middleware/authMiddleware");

// GET /catways - Lister tous les catways
router.get("/", authenticateToken, catwayService.getAllCatways);

// GET /catways/:id - Détails d'un catway
router.get("/:id", authenticateToken, catwayService.getCatwayById);

// POST /catways - Créer un catway
router.post("/", authenticateToken, catwayService.createCatway);

// PUT /catways/:id - Modifier l'état d'un catway
router.put("/:id", authenticateToken, catwayService.updateCatwayState);

// DELETE /catways/:id - Supprimer un catway
router.delete("/:id", authenticateToken, catwayService.deleteCatway);

module.exports = router;
