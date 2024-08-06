const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

  imageUrl: { type: String, required: true }, 
  link: { type: String, required: false } 
});

module.exports = mongoose.model('Banner', bannerSchema);
