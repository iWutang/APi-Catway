const express = require("express");
const router = express.Router();

const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");

const authenticateToken = require("../middleware/authMiddleware");

// GET /catways - Lister tous les catways
router.get("/", authenticateToken, async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json({
      success: true,
      data: catways,
      count: catways.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catways",
      error: error.message,
    });
  }
});

// GET /catways/:id - Détails d'un catway
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    res.json({
      success: true,
      data: catway,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du catway",
      error: error.message,
    });
  }
});

// POST /catways - Créer un catway
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { catwayNumber, type, catwayState } = req.body;

    // Validation
    if (!catwayNumber || !type || !catwayState) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const catway = new Catway({
      catwayNumber,
      type,
      catwayState,
    });

    await catway.save();

    res.status(201).json({
      success: true,
      message: "Catway créé avec succès",
      data: catway,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Ce numéro de catway existe déjà",
      });
    }
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du catway",
      error: error.message,
    });
  }
});

// PUT /catways/:id - Modifier l'état d'un catway
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { catwayState } = req.body;

    if (!catwayState) {
      return res.status(400).json({
        success: false,
        message: "Le champ catwayState est requis",
      });
    }

    const catway = await Catway.findByIdAndUpdate(
      req.params.id,
      { catwayState },
      { new: true }
    );

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    res.json({
      success: true,
      message: "État du catway mis à jour",
      data: catway,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du catway",
      error: error.message,
    });
  }
});

// DELETE /catways/:id - Supprimer un catway
router.delete("/catways/:id", authenticateToken, async (req, res) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    // Supprimer aussi les réservations associées
    await Reservation.deleteMany({ catwayId: req.params.id });

    res.json({
      success: true,
      message: "Catway supprimé avec succès",
      data: catway,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du catway",
      error: error.message,
    });
  }
});

module.exports = router;
