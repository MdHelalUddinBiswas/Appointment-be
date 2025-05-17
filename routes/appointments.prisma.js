const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const prisma = require('../services/prisma.service');

// Get all appointments for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const appointments = await prisma.appointments.findMany({
      where: {
        user_id: req.user.id
      },
      orderBy: {
        start_time: 'asc'
      }
    });
    
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific appointment
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user is authorized to view this appointment
    if (appointment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new appointment
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, start_time, end_time, location, participants } = req.body;
    
    const newAppointment = await prisma.appointments.create({
      data: {
        title,
        description,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        location,
        participants: participants ? JSON.stringify(participants) : null,
        user_id: req.user.id
      }
    });
    
    res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an appointment
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, start_time, end_time, location, participants, status } = req.body;
    
    // First check if appointment exists and belongs to user
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update appointment
    const updatedAppointment = await prisma.appointments.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: {
        title,
        description,
        start_time: start_time ? new Date(start_time) : undefined,
        end_time: end_time ? new Date(end_time) : undefined,
        location,
        participants: participants ? JSON.stringify(participants) : undefined,
        status
      }
    });
    
    res.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an appointment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // First check if appointment exists and belongs to user
    const appointment = await prisma.appointments.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    if (appointment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Delete appointment
    await prisma.appointments.delete({
      where: {
        id: parseInt(req.params.id)
      }
    });
    
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch participant calendar data (availability)
router.get('/participants/calendar', authenticateToken, async (req, res) => {
  try {
    const { participantIds, startDate, endDate } = req.query;
    
    console.log("Participant calendar request:", { 
      participantIds, 
      startDate, 
      endDate,
      user: req.user?.id
    });
    
    if (!participantIds) {
      return res.status(400).json({ message: "Participant IDs are required" });
    }
    
    // Parse participant IDs (comma-separated list)
    const participantIdArray = participantIds.split(',');
    console.log("Parsed participant IDs:", participantIdArray);
    
    // Extract email addresses and numeric IDs
    const numericIds = participantIdArray
      .filter(id => !isNaN(parseInt(id)))
      .map(id => parseInt(id));
    
    const emailAddresses = participantIdArray
      .filter(id => id.includes('@'));
      
    // Use Prisma to query participants' appointments
    const participantAppointments = await prisma.appointments.findMany({
      where: {
        OR: [
          {
            user_id: {
              in: numericIds,
            }
          },
          {
            participants: {
              path: '$.email',
              string_contains: emailAddresses.length > 0 ? emailAddresses[0] : '',
            }
          }
        ],
        start_time: {
          gte: startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 7)),
        },
        end_time: {
          lte: endDate ? new Date(endDate) : new Date(new Date().setDate(new Date().getDate() + 30)),
        }
      },
      orderBy: {
        start_time: 'asc'
      }
    });
    
    // Log the query result for debugging
    console.log(`Found ${participantAppointments.length} participant appointments`);
    
    // Return participant calendar data with privacy-preserving modifications
    const calendarData = participantAppointments.map(appointment => {
      try {
        // Check if current user is the appointment owner
        if (appointment.user_id === req.user.id) {
          return appointment;
        }
        
        // For appointments where user is just a participant, return limited info
        return {
          id: appointment.id,
          title: "Busy", // Hide actual title for privacy
          start_time: appointment.start_time,
          end_time: appointment.end_time,
          participant_availability: true,
          is_participant_calendar: true,
        };
      } catch (e) {
        console.error('Error processing appointment data:', e);
        return {
          id: appointment.id || 0,
          title: "Calendar Event",
          start_time: appointment.start_time || new Date().toISOString(),
          end_time: appointment.end_time || new Date().toISOString(),
          participant_availability: true,
        };
      }
    });
    
    console.log(`Returning ${calendarData.length} calendar events for participants`);
    res.json(calendarData);
  } catch (error) {
    console.error("Get participant calendar data error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
