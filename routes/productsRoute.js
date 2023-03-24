const {
  checkBodyToAddProduct,
  addItemToCart,
  checkBodyID,
  deleteItemFromCart,
  checkBodyToPlaceOrder,
  placeOrder,
} = require('./../middlewares/middlewareGuards');

const express = require('express');
const router = express.Router();
const fs = require('fs');
const allProducts = JSON.parse(
  fs.readFileSync(`${__dirname}/../data/products.json`) // __dirname ensures that the file is read from the correct directory path
);
let cart = JSON.parse(fs.readFileSync(`${__dirname}/../data/cart.json`));

// Get all products.
router.get('/api/products', (request, response) => {
  response
    .status(200)
    .json({ status: 'success', result: allProducts.length, allProducts });
});

// Add item to cart
router.post('/api/add-to-cart', checkBodyToAddProduct, addItemToCart);

// Delete item from cart.json file
router.delete('/api/cart/:id', checkBodyID, deleteItemFromCart);

// Get all products from your cart
router.get('/api/cart', (request, response) => {
  response.status(200).json({ status: 'success', result: cart.length, cart });
});

// Place order with cart items
router.post('/api/order', checkBodyToPlaceOrder, placeOrder);

module.exports = router;
