const express = require('express');
const router = express.Router();
const embeddingsController = require('../controllers/embeddings.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Ensure all routes are protected with authentication
router.use(authenticateToken);

// Embeddings routes
router.post('/embeddings/add-appointments', embeddingsController.addAppointments);
router.get('/embeddings/appointments', embeddingsController.getAppointments);
router.get('/appointments/:id', embeddingsController.getAppointmentById);
router.delete('/embeddings/appointments', embeddingsController.deleteAllAppointments);
router.delete('/embeddings/appointments/:id', embeddingsController.deleteAppointmentById);
router.put('/embeddings/appointments/:id', embeddingsController.updateAppointment);
router.put('/embeddings/appointments/:id/complete', embeddingsController.markAppointmentAsCompleted);
router.put('/embeddings/appointments/:id/cancel', embeddingsController.cancelAppointment);
router.post('/embeddings/appointments/:id/participants', embeddingsController.addParticipant);

module.exports = router;
