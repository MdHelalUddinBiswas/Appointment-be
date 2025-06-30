/**
 * Formats a date in a human-readable format
 * @param {Date|string} date - The date to format
 * @param {string} [timezone] - Optional timezone
 * @returns {string} Formatted date string
 */
function formatDate(date, timezone) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  try {
    if (timezone) {
      options.timeZone = timezone;
    }
    return new Date(date).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Error formatting date:', e);
    // Fallback to basic formatting if timezone is invalid
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

module.exports = {
  formatDate
};
