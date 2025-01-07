const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/Products');
const userRoutes = require('./routes/Users');
const orderRoutes = require('./routes/Orders');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());


app.use('/Products', productRoutes);
app.use('/Users', userRoutes);
app.use('/Orders', orderRoutes);

mongoose.connect('mongodb://localhost:27017/grocery_store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
