const express = require("express");
const router = express.Router();

//import des modèles
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

//Route pour créer un événement
router.post("/events/create", async (req, res) => {
  try {
    const event = await Event.findOne({
      name: req.fields.name,
      date: req.fields.date,
    });

    if (event !== null) {
      res
        .status(400)
        .json({ message: "A same event, at the same date, already exists!" });
    } else {
      const newEvent = await new Event({
        date: req.fields.date,
        name: req.fields.name,
        seats: {
          orchestre: req.fields.seats.orchestre,
          mezzanine: req.fields.seats.mezzanine,
        },
      });
      await newEvent.save();
      res.json({ message: "Event added!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour récupérer les événements à une date donnée
router.get("/events/availabilities", async (req, res) => {
  try {
    const tryToFindEventByDate = await Event.find({ date: req.query.date });
    if (tryToFindEventByDate.length > 0) {
      res.json(tryToFindEventByDate);
    } else {
      res.status(400).json({ message: "No event found with this date!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour récupérer les infos d'un événement
router.get("/events", async (req, res) => {
  try {
    const tryToFindEventById = await Event.findById(req.query.id);
    if (tryToFindEventById) {
      res.json(tryToFindEventById);
    } else {
      res.status(400).json({ message: "No event found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour supprimer un événement
router.post("/delete", async (req, res) => {
  try {
    const tryToFindEventById = await Event.findById(req.fields.id);

    if (tryToFindEventById) {
      // On recherche l'event à modifier à partir de son id et on le supprime :
      await Event.findByIdAndDelete(tryToFindEventById);
      const deletedTickets = await Ticket.deleteMany({
        eventId: req.fields.eventId,
      });
      // On répond au client
      res.json({
        message: `Event removed and ${deletedTickets.deletedCount} related tickets deleted`,
      });
    } else {
      res.status(400).json({ message: "Missing id" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
