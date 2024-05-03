/**
 * Formats a given date object into a string representation.
 * The resulting string is in the format "YYYY-MM-DD HH:mm:ss".
 *
 * @param date - The date object to be formatted.
 * @returns The formatted string representation of the date.
 */

export function formatDateTimeString(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function parseSeiueDateString(dateString: string) {
  return new Date(dateString).toISOString().split('.')[0];
}

export function transformDateToString(date: Date) {
  return date.toISOString().split('.')[0];
}

/**
 * Returns Monday of the current week.
 * The time is set to 00:00:00.
 * @returns Time string in the format of 'YYYY-MM-DD HH:mm:ss'.
 */
export function getMondayOfWeek() {
  const date = new Date((new Date()).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return formatDateTimeString(date);
}

/**
 * Returns Sunday two weeks later.
 * The time is set to 23:59:59.
 * @returns Time string in the format of 'YYYY-MM-DD HH:mm:ss'.
 */
export function getSundayTwoWeeksLater() {
  const date = new Date((new Date()).toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
  const day = date.getDay();
  const diff = day === 0 ? 14 : 14 + 7 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(23, 59, 59, 999);
  return formatDateTimeString(date);
}

export function splitCommaSeparatedString(source: string, splitSize: number) {
  const sourceArray = source.split(',');
  const groups = [];
  for (let i = 0; i < sourceArray.length; i += splitSize)
    groups.push(sourceArray.slice(i, i + splitSize).join(','));
  return groups;
}
