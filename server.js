const express = require('express');
const mongoose = require('mongoose');
const { createCinema, purchaseSeat, purchaseConsecutiveSeats } = require('./controllers/cinemaController');


// Create Express app
const app = express();
app.use(express.json())


const connectionString = 'mongodb://db:27017/cinema-db';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the Cinema schema
const cinemaSchema = new mongoose.Schema({
  seats: [Boolean], // Represents the availability of each seat
});
// const Cinema = mongoose.model('Cinema', cinemaSchema);

// Create a cinema with N seats
// app.post('/cinemas', async (req, res) => {
//   const { seats } = req.body;
//   const cinema = new Cinema({ seats: new Array(seats).fill(true) });
//   await cinema.save();
//   res.json({ cinemaId: cinema._id });
// });

// // Purchase a specific seat number in cinema C
// app.post('/cinemas/:cinemaId/seats/:seatNumber', async (req, res) => {
//   const { cinemaId, seatNumber } = req.params;
//   const cinema = await Cinema.findById(cinemaId);
//   if (!cinema) {
//     return res.status(404).json({ error: 'Cinema not found' });
//   }
//   if (seatNumber <= 0 || seatNumber >= cinema.seats.length) {
//     return res.status(400).json({ error: 'Invalid seat number' });
//   }
//   if (!cinema.seats[seatNumber]) {
//     return res.status(400).json({ error: 'Seat already purchased' });
//   }
//   cinema.seats[seatNumber] = false;
//   await cinema.save();
//   res.json({ seat: seatNumber });
// });

// // Purchase the first two free consecutive seats in cinema C
// app.post('/cinemas/:cinemaId/seats', async (req, res) => {
//   const { cinemaId } = req.params;
//   const cinema = await Cinema.findById(cinemaId);
//   if (!cinema) {
//     return res.status(404).json({ error: 'Cinema not found' });
//   }
//   const { seats } = cinema;
//   let firstSeat = -1;
//   for (let i = 0; i < seats.length - 1; i++) {
//     if (seats[i] && seats[i + 1]) {
//       firstSeat = i;
//       break;
//     }
//   }
//   if (firstSeat === -1) {
//     return res.status(400).json({ error: 'No two consecutive seats available' });
//   }
//   seats[firstSeat] = false;
//   seats[firstSeat + 1] = false;
//   await cinema.save();
//   res.json({ seats: [firstSeat, firstSeat + 1] });
// });

// // Start the server
// const port = 8080;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// Create a cinema with N seats
app.post('/cinemas', createCinema);

// Purchase a specific seat number in cinema C
app.post('/cinemas/:cinemaId/seats/:seatNumber', purchaseSeat);

// Purchase the first two free consecutive seats in cinema C
app.post('/cinemas/:cinemaId/consecutive', purchaseConsecutiveSeats);

// Start the server
const port = 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});