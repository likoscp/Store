const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const middlewareAuth = require("./middleware/middlewareAuth");
const roleMiddleware = require("./middleware/RoleMiddleware");

const productRoutes = require("./routes/Products");
const userRoutes = require("./routes/Users");
const orderRoutes = require("./routes/Orders");
const postRoutes = require("./routes/Posts");
const ticketRoutes = require("./routes/Tickets");
const messageRoutes = require("./routes/Messages");
const AuthRoutes = require("./routes/Authentication");
const filterRoutes = require("./routes/Filters");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.static("script"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const cors = require("cors");
app.use(
  cors({
    origin: "https://store-beige-theta.vercel.app",
    credentials: true,
  })
);

app.use("/Swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/Products", productRoutes);
app.use("/Users", middlewareAuth, userRoutes);
app.use("/Orders", middlewareAuth, orderRoutes);
app.use("/Tickets", middlewareAuth, ticketRoutes);
app.use("/Messages", middlewareAuth, messageRoutes);
app.use("/Posts", postRoutes);
app.use("/Filter", filterRoutes);
app.use("/Auth", AuthRoutes);

mongoose.connect(
  "mongodb+srv://SabinaMongoDB:LikoMongoNode@cluster0.ffv0e.mongodb.net/Store"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/view/index.html"));
});
