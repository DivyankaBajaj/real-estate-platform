import Appointment from '../models/Appointment.js';

// Helper function to get today's date as a strict string (YYYY-MM-DD)
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const bookAuth = async (req, res) => {
  try {
    const { propertyId, date, time, message } = req.body;

    // String comparison is foolproof for YYYY-MM-DD formats
    if (date < getTodayString()) {
      return res.status(400).json({ message: 'You cannot book a viewing for a past date.' });
    }

    const appointment = await Appointment.create({
      property: propertyId, 
      user: req.user._id, 
      date, 
      time, 
      message
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookGuest = async (req, res) => {
  try {
    const { propertyId, guestName, guestEmail, guestPhone, date, time, message } = req.body;

    if (date < getTodayString()) {
      return res.status(400).json({ message: 'You cannot book a viewing for a past date.' });
    }

    const appointment = await Appointment.create({
      property: propertyId, 
      guestName, 
      guestEmail, 
      guestPhone, 
      date, 
      time, 
      message
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id }).populate('property');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};