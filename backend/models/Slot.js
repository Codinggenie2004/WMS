const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  area: {
    type: String,
    required: true
  },
  slotId: {
    type: String,
    required: true,
    unique: true
  },
  isEmpty: {
    type: Boolean,
    default: true
  },
  productId: {
    type: String,
    default: null
  }
});

module.exports = mongoose.model("Slot", SlotSchema);