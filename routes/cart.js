const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/account/login?redirect=' + encodeURIComponent(req.originalUrl));
};

router.use(isAuthenticated);

router.post('/add', async (req, res) => {
    try {
        const productId = req.body.productId;
        const userId = req.user._id;

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += 1;
        } else {
            cart.items.push({ productId });
        }

        await cart.save();
        res.redirect('/cart');
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).send('Server error');
    }
});

router.delete('/remove/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const userId = req.user.id; 
        const cart = await Cart.findOne({ userId: userId });
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false });
    }
});

router.get('/', async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        res.render('cart', { cart: cart || { items: [] }, authenticated: true, name: req.user.name });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;