/******* INIT REQUIREMENTS ********/
const express = require('express');
const { json } = require('express');
const app = express();
const PORT = process.env.PORT || 8000; // use port 8000 unless there exists a preconfigured port (for example when deployed)
const productsRoute = require('./routes/productsRoute');
const swaggerUI = require('swagger-ui-express');
const apiDocs = require('./docs/docs.json');

/******* MIDDLEWARE FUNCTION ********/
app.use(express.json());
app.use('/api/docs', swaggerUI.serve); // creates a template html,css file
app.get('/api/docs', swaggerUI.setup(apiDocs)); // push all information from our docs to the swaggerUI.serve site

app.use(productsRoute);

/******* START SERVER ********/
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}... 🏃🏻`);
});
