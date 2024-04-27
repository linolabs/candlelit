export function getMondayOfWeek() {
  const date = new Date((new Date()).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().replace(/T|(\.\d{3})Z/g, ' ').trim();
}

export function getSundayTwoWeeksLater() {
  const date = new Date((new Date()).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const day = date.getDay();
  const diff = day === 0 ? 14 : 14 + 7 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return date.toISOString().replace(/T|(\.\d{3})Z/g, ' ').trim();
}
