const mongoose = require("mongoose");

const Event = mongoose.model("Event", {
  date: String,
  name: String,
  seats: {
    orchestre: Number,
    mezzanine: Number,
  },
});

module.exports = Event;
