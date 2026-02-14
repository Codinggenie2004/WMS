const mongoose = require("mongoose");

const AreaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Area", AreaSchema);