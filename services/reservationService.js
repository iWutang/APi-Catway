const Catway = require("../models/Catway");
const Reservation = require("../models/Reservation");
const mongoose = require("mongoose");

// GET /catways/:id/reservationsList
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find();
    res.json({ reservations });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des réservations",
      error: error.message,
    });
  }
};

// GET /catways/:id/reservations
exports.getReservationsByCatway = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id).populate(
      "reservations.user",
      "name email"
    );
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });
    res.json(catway.reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /catways/:catwayId/reservations/:reservationId
exports.getReservationById = async (req, res) => {
  try {
    const { catwayId, reservationId } = req.params;
    const catway = await Catway.findById(catwayId).populate(
      "reservations.user",
      "name email"
    );
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });

    const reservation = catway.reservations.id(reservationId);
    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /catways/:id/reservations
exports.createReservation = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });

    const { startAt, endAt, notes } = req.body;
    if (!startAt || !endAt)
      return res.status(400).json({ message: "startAt et endAt requis" });

    const s = new Date(startAt);
    const e = new Date(endAt);
    if (s >= e)
      return res.status(400).json({ message: "startAt doit être avant endAt" });

    // Vérifie les conflits de réservations
    const conflict = catway.reservations.some((r) => {
      const rs = new Date(r.startAt);
      const re = new Date(r.endAt);
      return s < re && e > rs;
    });
    if (conflict)
      return res.status(409).json({ message: "Plage horaire déjà réservée" });

    const reservation = { user: req.user._id, startAt: s, endAt: e, notes };
    catway.reservations.push(reservation);
    await catway.save();

    const newRes = catway.reservations[catway.reservations.length - 1];
    res.status(201).json(newRes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /catways/:catwayId/reservations/:reservationId
exports.deleteReservation = async (req, res) => {
  try {
    const { catwayId, reservationId } = req.params;
    const catway = await Catway.findById(catwayId);
    if (!catway) return res.status(404).json({ message: "Catway introuvable" });

    const reservation = catway.reservations.id(reservationId);
    if (!reservation)
      return res.status(404).json({ message: "Réservation introuvable" });

    if (
      String(reservation.user) !== String(req.user._id) &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ message: "Non autorisé" });

    reservation.remove();
    await catway.save();
    res.json({ message: "Réservation supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
