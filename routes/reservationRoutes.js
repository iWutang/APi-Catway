const express = require("express");
const router = express.Router();

const Reservation = require("../models/Reservation");
const Catway = require("../models/Catway");

const authenticateToken = require("../middleware/authMiddleware");

// GET /:catwayId - Lister les réservations d'un catway
router.get("/:catwayId", authenticateToken, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    const reservations = await Reservation.find({ catwayId: req.params.id });

    res.json({
      success: true,
      data: reservations,
      count: reservations.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des réservations",
      error: error.message,
    });
  }
});

// GET /:catwayId/:idReservation - Détails d'une réservation
router.get("/:catwayId/:idReservation", authenticateToken, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayId: req.params.id,
    }).populate("catwayId");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Réservation non trouvée",
      });
    }

    res.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la réservation",
      error: error.message,
    });
  }
});

// POST /reservations/:catwayId - Créer une réservation
router.post("/:catwayId", authenticateToken, async (req, res) => {
  try {
    const { clientName, boatName, checkIn, checkOut } = req.body;

    // Validation
    if (!clientName || !boatName || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    // Vérifier que le catway existe
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

    // Vérifier les conflits de dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "La date de début doit être avant la date de fin",
      });
    }

    const conflictingReservation = await Reservation.findOne({
      catwayId: req.params.id,
      $or: [
        {
          checkIn: { $lte: checkOutDate },
          checkOut: { $gte: checkInDate },
        },
      ],
    });

    if (conflictingReservation) {
      return res.status(409).json({
        success: false,
        message: "Ce catway est déjà réservé pour ces dates",
      });
    }

    // Créer la réservation
    const reservation = new Reservation({
      catwayId: req.params.id,
      catwayNumber: catway.catwayNumber,
      clientName,
      boatName,
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Réservation créée avec succès",
      data: reservation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de la réservation",
      error: error.message,
    });
  }
});

// DELETE /reservations/:catwayId/:idReservation - Supprimer une réservation
router.delete(
  "/:catwayId/:idReservation",
  authenticateToken,
  async (req, res) => {
    try {
      const reservation = await Reservation.findOneAndDelete({
        _id: req.params.idReservation,
        catwayId: req.params.id,
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: "Réservation non trouvée",
        });
      }

      res.json({
        success: true,
        message: "Réservation supprimée avec succès",
        data: reservation,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Erreur lors de la suppression de la réservation",
        error: error.message,
      });
    }
  }
);

module.exports = router;
