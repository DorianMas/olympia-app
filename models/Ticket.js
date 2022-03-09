const mongoose = require("mongoose");

const Ticket = mongoose.model("Ticket", {
  mail: String,
  username: String,
  date: String,
  category: String,
  seats: Number,
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = Ticket;
