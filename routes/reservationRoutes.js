const express = require("express");
const router = express.Router();

const reservationService = require("../services/reservationService");

const authenticateToken = require("../middleware/authMiddleware");

// GET /reservations - Récupérer toutes les réservations
router.get("/", authenticateToken, reservationService.getAllReservations);

// GET /reservations/:id - Récupérer une réservation par ID
router.get("/:id", authenticateToken, reservationService.getReservationById);

// GET /catways/:id/reservations - Récupérer les réservations d'un catway
router.get(
  "/:id/reservations",
  authenticateToken,
  reservationService.getReservationsByCatway
);

// POST /reservations - Créer une nouvelle réservation
router.post("/", authenticateToken, reservationService.createReservation);

// DELETE /reservations/:id - Supprimer une réservation
router.delete("/:id", authenticateToken, reservationService.deleteReservation);

module.exports = router;
