// index.js

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const passport = require('passport');
const xsenv = require('@sap/xsenv');
const { JWTStrategy } = require('@sap/xssec');

const bodyParser = require('body-parser');
const path = require('path');

const {
    getProducts,
    getProductsByName,
    addProduct,
    updateProduct,
    deleteProduct
} = require('./lib/repository');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files before authentication middleware
app.use(express.static(path.join(__dirname, 'static')));
// Serve images from the resources directory
app.use('/resources/images', express.static(path.join(__dirname, 'resources/images')));

// Load XSUAA service
const services = xsenv.getServices({ uaa: { tag: 'xsuaa' } });
passport.use(new JWTStrategy(services.uaa));

// Initialize Passport
app.use(passport.initialize());

// Protect API routes
app.use('/products', passport.authenticate('JWT', { session: false }));

// API Endpoints with scope checks
app.get('/products', checkScope('force_read'), getProducts);
app.get('/products/:name', checkScope('force_read'), getProductsByName);
app.post('/products', checkScope('force_edit'), addProduct);
app.put('/products/:name', checkScope('force_edit'), updateProduct);
app.delete('/products/:name', checkScope('force_admin'), deleteProduct);

// Middleware: Check scope
function checkScope(requiredScope) {
    return (req, res, next) => {
        try {
            if (req.authInfo && req.authInfo.checkLocalScope(requiredScope)) {
                console.log(`Scope "${requiredScope}" validated.`);
                next();
            } else {
                console.error(`Missing required scope: ${requiredScope}`);
                res.status(403).send(`Forbidden: Missing Scope (${requiredScope})`);
            }
        } catch (error) {
            console.error("Error in checkScope middleware:", error);
            res.status(500).send("Internal Server Error in middleware.");
        }
    };
}

// Start the backend server
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});
