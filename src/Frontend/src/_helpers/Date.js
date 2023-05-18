
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    timeZone: 'Europe/Berlin'
  }).format(new Date(date));
}

export const date = {
  formatDate: formatDate
};

  