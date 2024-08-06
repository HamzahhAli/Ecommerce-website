const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  section: { type: String, enum: ['featured', 'greatDeals', 'newArrivals', 'topRated'], default: 'featured' } 
});

module.exports = mongoose.model('Product', productSchema);
