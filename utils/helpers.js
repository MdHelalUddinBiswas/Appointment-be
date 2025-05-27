/**
 * Helper utility functions for the MeetNing Appointment AI application
 */

/**
 * Helper function to safely get environment variables
 * @param {string} key - Environment variable key
 * @param {string} defaultValue - Default value if not found
 * @returns {string} Environment variable value or default
 */
function getEnvVariable(key, defaultValue = "") {
  const value = process.env[key];
  if (!value && defaultValue === "") {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }
  return value || defaultValue;
}

/**
 * Format participants into a standard format (array of objects with email property)
 * @param {Array|string} participants - Participants in various formats
 * @returns {Array} Array of participant objects with email property
 */
function formatParticipants(participants) {
  let formattedParticipants = [];
  
  if (!participants) {
    return formattedParticipants;
  }
  
  if (Array.isArray(participants)) {
    formattedParticipants = participants.map(participant => {
      if (typeof participant === 'object' && participant.email) {
        return participant;
      }
      if (typeof participant === 'string') {
        return { email: participant };
      }
      return { email: String(participant) };
    });
  } else if (typeof participants === 'string') {
    formattedParticipants = participants
      .split(',')
      .map(email => ({ email: email.trim() }))
      .filter(p => p.email.length > 0);
  }
  
  return formattedParticipants;
}

/**
 * Generate a formatted appointment content string for vector store
 * @param {Object} appointment - Appointment data
 * @param {number} participantsCount - Number of participants
 * @returns {string} Formatted content string
 */
function generateAppointmentContent(appointment, participantsCount = 0) {
  const formattedStartTime = new Date(appointment.start_time).toLocaleString();
  const formattedEndTime = new Date(appointment.end_time).toLocaleString();
  
  return `Appointment: ${appointment.title}. ` +
    `Description: ${appointment.description || "No description"}. ` +
    `This appointment is scheduled for ${formattedStartTime} to ${formattedEndTime}. ` +
    `Location: ${appointment.location || "No location specified"}. ` +
    `Status: ${appointment.status || "scheduled"}. ` +
    `This appointment has ${participantsCount} participants.`;
}

module.exports = {
  getEnvVariable,
  formatParticipants,
  generateAppointmentContent
};
