const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CinemaSchema = new Schema({
    seats: [Boolean], // Represents the availability of each seat
  });

const Cinema = mongoose.model('cinema', CinemaSchema);

module.exports = Cinema;
