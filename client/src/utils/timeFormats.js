export const getRelativeTime = (timestamp) => {
  const now = new Date(); // Current date and time
  const date = new Date(timestamp); // Provided timestamp

  const diffInMs = now - date; // Time difference in milliseconds
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60)); // Convert to hours
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
  const diffInWeeks = Math.floor(diffInDays / 7); // Convert to weeks
  const diffInYears = now.getFullYear() - date.getFullYear(); // Year difference

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`; // Within 1 hour
  } else if (diffInHours < 24) {
    return `${diffInHours}h`; // Within 24 hours
  } else if (diffInDays < 7) {
    return `${diffInDays}d`; // Within 1 week
  } else if (diffInYears < 1) {
    return `${diffInWeeks}w`; // Within 1 year
  } else {
    return `${diffInYears}y`; // More than 1 year ago
  }
};
