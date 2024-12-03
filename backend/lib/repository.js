// lib/repository.js

const path = require('path');
const fs = require('fs');

// Path to the products.json file
const productsFilePath = path.join(__dirname, 'products.json');

// Load products data
let repository = {};
if (fs.existsSync(productsFilePath)) {
    repository = require('./products.json');
} else {
    // Initialize with empty object if file doesn't exist
    repository = {};
}

// Helper function to save repository data to file
function saveRepository() {
    fs.writeFileSync(productsFilePath, JSON.stringify(repository, null, 2));
}

// Get all products
function getProducts(req, res) {
    try {
        const result = Object.values(repository);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).send(result);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

// Get a product by name
function getProductsByName(req, res) {
    try {
        const productName = req.params.name;
        const product = repository[productName];
        if (product) {
            res.status(200).send(product);
        } else {
            res.status(404).send({ error: `Product "${productName}" not found` });
        }
    } catch (error) {
        console.error("Error fetching product by name:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

// Add a new product
function addProduct(req, res) {
    try {
        const newProduct = req.body;

        if (!newProduct || !newProduct.name) {
            return res.status(400).send({ error: "Invalid product data. 'name' is required." });
        }

        if (repository[newProduct.name]) {
            return res.status(409).send({ error: `Product "${newProduct.name}" already exists.` });
        }

        repository[newProduct.name] = newProduct;
        saveRepository();
        res.status(201).send({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

// Update an existing product
function updateProduct(req, res) {
    try {
        const productName = req.params.name;
        const updatedData = req.body;

        if (!repository[productName]) {
            return res.status(404).send({ error: `Product "${productName}" not found.` });
        }

        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).send({ error: "Invalid update data." });
        }

        Object.assign(repository[productName], updatedData);
        saveRepository();
        res.status(200).send({ message: `Product "${productName}" updated successfully.` });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

// Delete a product
function deleteProduct(req, res) {
    try {
        const productName = req.params.name;

        if (!repository[productName]) {
            return res.status(404).send({ error: `Product "${productName}" not found.` });
        }

        delete repository[productName];
        saveRepository();
        res.status(200).send({ message: `Product "${productName}" deleted successfully.` });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).send({ error: "Internal Server Error" });
    }
}

module.exports = {
    getProducts,
    getProductsByName,
    addProduct,
    updateProduct,
    deleteProduct
};
