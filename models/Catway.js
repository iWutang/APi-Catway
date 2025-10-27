const mongoose = require("mongoose");

const catwaySchema = new mongoose.Schema({
  catwayNumber: { type: Number, unique: true, required: true },
  type: { type: String, required: true },
  catwayState: { type: String, required: true },
});

module.exports = mongoose.model("Catway", catwaySchema);
