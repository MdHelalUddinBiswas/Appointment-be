/**
 * Formats a date and time according to the user's timezone
 * @param {Date} date - The date to format
 * @param {string} [timezone] - The user's timezone (e.g., 'Asia/Dhaka')
 * @returns {string} Formatted date and time string
 */
function formatDateTime(date, timezone) {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid date';
  }

  try {
    const formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone
    };

    // First format the date part
    const dateStr = date.toLocaleDateString(undefined, {
      timeZone: timezone,
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Then format the time part
    const timeStr = date.toLocaleTimeString(undefined, {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${dateStr} | ${timeStr}`;
  } catch (e) {
    // Fallback if timezone is not supported or any other error occurs
    console.error('Error formatting date:', e);
    const fallbackDate = date.toLocaleDateString();
    const fallbackTime = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${fallbackDate} | ${fallbackTime}`;
  }
}

module.exports = {
  formatDateTime
};
