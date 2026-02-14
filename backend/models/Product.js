const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  quantity: {
    type: Number,
    default: 1
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  slotId: String,
  photo: String, // Base64 encoded photo
  qrCode: String,
  addedBy: String,
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", ProductSchema);