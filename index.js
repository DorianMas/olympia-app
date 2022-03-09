const express = require("express");
const app = express();

//Création du serveur
const formidableMiddleware = require("express-formidable");
app.use(formidableMiddleware());

// Connexion à la BDD
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/olympia-app");

app.get("/", (req, res) => {
  res.json({ message: "Hi!" });
});

//import des routes
const eventsRoutes = require("./routes/events");
app.use(eventsRoutes);
const ticketsRoutes = require("./routes/tickets");
app.use(ticketsRoutes);

app.listen(3000, () => {
  console.log("Server has started!");
});
