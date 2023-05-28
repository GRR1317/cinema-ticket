const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Data storage
let cinemas = [];

// Helper function to find a cinema by ID
function findCinemaById(cinemaId) {
  return cinemas.find(cinema => cinema.id === cinemaId);
}

// Helper function to check if a seat is already purchased
function isSeatPurchased(cinema, seatNumber) {
  return cinema.purchasedSeats.includes(seatNumber);
}

// Helper function to check is a seat is persent
function isSeatValid(seatNumber, cinemaId){
  let cinema = findCinemaById(cinemaId);
  let seats = cinema.seats;
  return seatNumber >= 1 && seatNumber <= seats;
}

// Endpoint to create a cinema with N seats
app.post('/cinema', (req, res) => {
  const { seats } = req.body;
  const cinemaId = "id" + Math.random().toString(16).slice(2);

  const cinema = {
    id: cinemaId,
    seats: seats,
    purchasedSeats: []
  };

  cinemas.push(cinema);

  res.json({ cinemaId });
});

// Endpoint to purchase a specific seat in cinema C
app.post('/cinema/:cinemaId/seats/:seatNumber', (req, res) => {
  const { cinemaId, seatNumber } = req.params;

  const cinema = findCinemaById(cinemaId);

  if (!cinema) {
    return res.status(404).json({ error: 'Cinema not found' });
  }

  if (isSeatPurchased(cinema, seatNumber)) {
    return res.status(400).json({ error: 'Seat already purchased' });
  }

  if (!isSeatValid(seatNumber, cinemaId)) {
    return res.status(400).json({ error: 'Invalid Seat number' });
  }

  cinema.purchasedSeats.push(seatNumber);

  res.json({ seat: seatNumber });
});

// Endpoint to purchase the first two free consecutive seats in cinema C
app.post('/cinema/:cinemaId/seats/consecutive', (req, res) => {
  const { cinemaId } = req.params;

  const cinema = findCinemaById(cinemaId);

  if (!cinema) {
    return res.status(404).json({ error: 'Cinema not found' });
  }

  const { seats } = cinema;

  let consecutiveSeats = [];
  let count = 0;

  for (let i = 0; i < seats.length; i++) {
    if (!isSeatPurchased(cinema, seats[i])) {
      consecutiveSeats.push(seats[i]);
      count++;

      if (count === 2) {
        break;
      }
    } else {
      consecutiveSeats = [];
      count = 0;
    }
  }

  if (consecutiveSeats.length < 2) {
    return res.status(400).json({ error: 'No consecutive seats available' });
  }

  consecutiveSeats.forEach(seat => {
    cinema.purchasedSeats.push(seat);
  });

  res.json({ seats: consecutiveSeats });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
