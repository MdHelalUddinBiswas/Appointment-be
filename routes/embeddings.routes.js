const express = require('express');
const router = express.Router();
const embeddingsController = require('../controllers/embeddings.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ensure all routes are protected with authentication
router.use(authenticateToken);

// Embeddings routes
router.post('/add-appointments', embeddingsController.addAppointments);
router.get('/appointments', embeddingsController.getAppointments);
router.get('/appointments/:id', embeddingsController.getAppointmentById);
router.delete('/appointments', embeddingsController.deleteAllAppointments);
router.delete('/appointments/:id', embeddingsController.deleteAppointmentById);
router.put('/appointments/:id', embeddingsController.updateAppointment);
router.put('/appointments/:id/complete', embeddingsController.markAppointmentAsCompleted);
router.put('/appointments/:id/cancel', embeddingsController.cancelAppointment);
router.post('/appointments/:id/participants', embeddingsController.addParticipant);

module.exports = router;
