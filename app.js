const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/Products');
const userRoutes = require('./routes/Users');
const orderRoutes = require('./routes/Orders');
const postRoutes = require('./routes/Posts');
const ticketRoutes = require('./routes/Tickets');
const messageRoutes = require('./routes/Messages');
const path = require('path');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/Swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/Products', productRoutes);
app.use('/Users', userRoutes);
app.use('/Orders', orderRoutes);
app.use('/Tickets', ticketRoutes);
app.use('/Messages', messageRoutes);
app.use('/Posts', postRoutes);

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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/view/index.html'));
});
