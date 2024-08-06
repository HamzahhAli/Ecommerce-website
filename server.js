const express = require('express');
const app = express();
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product'); 
const path = require('path');
const Banner = require('./models/Banner');


mongoose.connect('mongodb://localhost:27017/ecomDB').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
});

app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method')); 

app.get("/", async (req, res) => {
    try {
        const products = await Product.find(); 
        const banners = await Banner.find();
        const isAuthenticated = req.isAuthenticated();
        const userName = isAuthenticated ? req.user.name : 'Guest';
        const sections = {
            featured: [],
            greatDeals: [],
            newArrivals: [],
            topRated: []
        };
        products.forEach(product => {
            if (sections[product.section]) {
                sections[product.section].push(product);
            }
        });
        res.render("index", { name: userName, authenticated: isAuthenticated, products: products, banners, sections });
    } catch (err) {
        console.error('Failed to fetch products:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.get("/products/:id", async (req, res) => {
    const product = await Product.findById(req.params.id); 
    const isAuthenticated = req.isAuthenticated();
    const userName = req.user ? req.user.name : 'Guest'; 
    res.render("products", { name: userName, authenticated: isAuthenticated, product });
    
})

const accountRouter = require('./routes/account');
app.use('/account', accountRouter);

const adminRouter = require('./routes/admin'); 
app.use('/admin', adminRouter); 

const cartRouter = require('./routes/cart');
app.use('/cart', cartRouter);

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);

app.use(express.static(path.join(__dirname, 'static')));

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
