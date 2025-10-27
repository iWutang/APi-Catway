const Catway = require("../models/Catway");
const mongoose = require("mongoose");

// Récupérer tous les catways
exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json({ catways });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des catways",
      error: error.message,
    });
  }
};

// Récupérer un catway par ID
exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }
    res.json({ catway });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du catway",
      error: error.message,
    });
  }
};

// Créer un nouveau catway
exports.createCatway = async (req, res) => {
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
};

// Mettre à jour l'état d'un catway
exports.updateCatwayState = async (req, res) => {
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
};

// Supprimer un catway
exports.deleteCatway = async (req, res) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);

    if (!catway) {
      return res.status(404).json({
        success: false,
        message: "Catway non trouvé",
      });
    }

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
};

// Mettre à jour l'état d'un catway
exports.updateCatwayState = async (req, res) => {
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
};
