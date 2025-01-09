const mongoose = require('mongoose');

const featureImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
});

const FeatureImage = mongoose.model('FeatureImage', featureImageSchema);

module.exports = FeatureImage;
