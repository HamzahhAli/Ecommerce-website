const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
    const query = req.query.query;
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.json(products); 
        }

        const isAuthenticated = req.isAuthenticated();
        const userName = isAuthenticated ? req.user.name : 'Guest';
        res.render('searchResults', { products, query, authenticated: isAuthenticated, name: userName });
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).send('An error occurred while searching for products.');
    }
});

module.exports = router;
