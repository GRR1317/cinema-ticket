const { Mutex } = require('async-mutex');

const locks = new Map();
const Cinema = require('../models/Cinema.model');

// Create a cinema with N seats
const createCinema = async (req, res) => {
  try {
    const { seats } = req.body;
    const cinema = new Cinema({ seats: new Array(seats).fill(true) });
    await cinema.save();
    res.json({ cinemaId: cinema._id });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Purchase a specific seat number in cinema C
const purchaseSeat = async (req, res) => {
  try {
    const { cinemaId, seatNumber } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    if (seatNumber < 0 || seatNumber >= cinema.seats.length) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }
    if (!cinema.seats[seatNumber]) {
      return res.status(400).json({ error: 'Seat already purchased' });
    }
    
    // Acquire a lock for the specific seat
    if (locks.has(seatNumber)) {
      const release = await locks.get(seatNumber).acquire();
      try {
        cinema.seats[seatNumber] = false;
        await cinema.save();
      } finally {
        release();
      }
    } else {
      const mutex = new Mutex();
      const release = await mutex.acquire();
      locks.set(seatNumber, mutex);
      try {
        cinema.seats[seatNumber] = false;
        await cinema.save();
      } finally {
        release();
        locks.delete(seatNumber);
      }
    }
    
    // Send the success response with the booked seat
    res.json({ seat: seatNumber, status: 'Booked' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const purchaseConsecutiveSeats = async (req, res) => {
  try {
    const { cinemaId } = req.params;
    const cinema = await Cinema.findById(cinemaId);
    if (!cinema) {
      return res.status(404).json({ error: 'Cinema not found' });
    }
    const { seats } = cinema;
    let firstSeat = -1;
    for (let i = 0; i < seats.length - 1; i++) {
      if (seats[i] && seats[i + 1]) {
        firstSeat = i;
        break;
      }
    }
    if (firstSeat === -1) {
      return res.status(400).json({ error: 'No two consecutive seats available' });
    }
    
    // Acquire a lock for the consecutive seats
    if (locks.has(firstSeat)) {
      const release = await locks.get(firstSeat).acquire();
      try {
        seats[firstSeat] = false;
        seats[firstSeat + 1] = false;
        await cinema.save();
      } finally {
        release();
      }
    } else {
      const mutex = new Mutex();
      const release = await mutex.acquire();
      locks.set(firstSeat, mutex);
      try {
        seats[firstSeat] = false;
        seats[firstSeat + 1] = false;
        await cinema.save();
      } finally {
        release();
        locks.delete(firstSeat);
      }
    }
    
    // Send the success response with the booked seats
    res.json({ seats: [firstSeat, firstSeat + 1], status: 'Booked' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { createCinema, purchaseSeat, purchaseConsecutiveSeats };
