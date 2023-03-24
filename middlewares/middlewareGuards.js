const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); // id generator

let cart = JSON.parse(fs.readFileSync(`${__dirname}/../data/cart.json`));
function checkBodyToAddProduct(request, response, next) {
  const { title, price, shortDesc, imgFile, serial } = request.body;

  // if the the incoming request.body with properties of title and serial already exists in the cart. itemExists becomes true.
  const itemExists = cart.some(
    (item) =>
      item.title === request.body.title && item.serial === request.body.serial
  );

  if ((title, price, shortDesc, imgFile, serial && !itemExists)) {
    next();
  } else {
    response.status(400).json({
      status: 'error',
      message:
        'Missing required properties or You are trying to add an already existing item in the cart. Which is not allowed ⛔️',
    });
  }
}

function addItemToCart(request, response) {
  const itemAddedToCart = { ...request.body, id: uuidv4() };
  cart.push(itemAddedToCart);
  // Adds the item to cart.json file
  fs.writeFile(
    `${__dirname}/../data/cart.json`,
    JSON.stringify(cart),
    (error) => {
      if (error) {
        response.status(500).json({
          status: 'error',
          message: 'Something went wrong.',
        });
      } else {
        response.status(201).json({
          status: 'true',
          message: 'Item added to cart',
          result: cart.length,
          cart: cart,
        });
      }
    }
  );
}

function checkBodyID(request, response, next) {
  const findItemToDelete = cart.find((item) => item.id === request.params.id);
  if (findItemToDelete) {
    next();
  } else {
    response
      .status(404)
      .json({ status: 'error', message: 'Something went wrong' });
  }
}

function deleteItemFromCart(request, response) {
  const deleteItem = cart.filter((item) => item.id !== request.params.id);

  // deletes the item from cart.json file
  fs.writeFile(
    `${__dirname}/../data/cart.json`,
    JSON.stringify(deleteItem),
    (error) => {
      if (error) {
        response
          .status(404)
          .json({ status: 'error', message: 'File could NOT be updated!🥲' });
      } else {
        response
          .status(204)
          .json({ status: 'true', message: 'Item deleted from cart' });
      }
    }
  );
}

function checkBodyToPlaceOrder(request, response, next) {
  const { fullName, address, city, zipCode, email, phoneNumber, cardNumber } =
    request.body;

  const requestRequirement = {
    fullName,
    address,
    city,
    zipCode,
    email,
    phoneNumber,
    cardNumber,
  };
  const keyValues = Object.values(requestRequirement); // Converts object to array with with the values of the properties
  const keyValuesExists = keyValues.every((value) => {
    if (value !== '') {
      return value;
    }
  });

  if (keyValuesExists && cart.length !== 0) {
    next();
  } else {
    response.status(404).json({
      status: 'error',
      message: 'Something went wrong! Your cart might be empty 🛒',
    });
  }
}

function placeOrder(request, response) {
  const { fullName, address, email, phoneNumber } = request.body;

  response.status(200).json({
    status: 'success',
    message: 'Order received',
    orderNumber: uuidv4(),
    customer: { fullName, address, email, phoneNumber },
    cart,
  });

  cart = [];

  fs.writeFile(
    `${__dirname}/../data/cart.json`,
    JSON.stringify(cart),
    (error) => {
      if (error) {
        response
          .status(404)
          .json({ status: 'error', message: 'Something went wrong' });
      }
    }
  );
}

module.exports = {
  checkBodyToAddProduct,
  addItemToCart,
  checkBodyID,
  deleteItemFromCart,
  checkBodyToPlaceOrder,
  placeOrder,
};
