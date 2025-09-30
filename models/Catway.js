const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  catwayState: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Catway", catwaySchema);
