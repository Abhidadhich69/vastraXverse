const mongoose = require("mongoose");

const FeatureImageSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("FeatureImage", FeatureImageSchema);
