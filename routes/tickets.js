const express = require("express");
const { is } = require("express/lib/request");
const router = express.Router();

//import des modèles
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

//Route pour effectuer une réservation
router.post("/tickets/book", async (req, res) => {
  try {
    if (
      req.fields.seats > 4 ||
      req.fields.seats < 1 ||
      (req.fields.category !== "orchestre" &&
        req.fields.category !== "mezzanine")
    ) {
      res.status(400).json({ error: { message: "Invalid request" } });
    } else {
      //On cherche l'event en fonction de son ID
      const isEventExisting = await Event.findById(req.fields.eventId);

      if (isEventExisting) {
        //Si je rentre dans ce if, je sais que l'event existe
        // Il faut vérifier qu'il reste suffisamment de places
        if (isEventExisting.seats[req.fields.category] >= req.fields.seats) {
          //Il reste assez de places
          isEventExisting.seats[req.fields.category] =
            isEventExisting.seats[req.fields.category] - req.fields.seats;
          // Exemple : 1146 = 1146 - 2
          await isEventExisting.save();
          console.log(isEventExisting);
          // Création de la nouvelle réservation
          const newTicket = await new Ticket({
            mail: req.fields.mail,
            username: req.fields.username,
            category: req.fields.category,
            seats: req.fields.seats,
            eventId: isEventExisting,
            date: isEventExisting.date,
          });
          await newTicket.save();

          res.json({
            message: `${req.fields.seats} seat(s) successfully booked!`,
          });
        } else {
          res.status(400).json({ message: "Not enought seats available" });
        }
      } else {
        res.status(400).json({ message: "Event not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour obtenir les infos d'une réservation
router.post("/tickets", async (req, res) => {
  try {
    const tryToFindTickets = await Ticket.find({
      mail: req.fields.mail,
    }).populate("eventId");
    res.json(tryToFindTickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour annuler une réservation

router.post("/tickets/cancel", async (req, res) => {
  const tryToFindTicketById = await Ticket.findById(req.fields.id);

  if (tryToFindTicketById) {
    await Ticket.findByIdAndDelete(tryToFindTicketById);
  }
});

module.exports = router;
