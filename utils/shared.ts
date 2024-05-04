import { CalendarDateTime, endOfWeek, parseDateTime, startOfWeek } from '@internationalized/date';

export function parseSeiueDateString(dateString: string) {
  return parseDateTime(dateString.replace(' ', 'T')).toString();
}
/**
 * Note: seconds are set to 0.
 * @returns CalendarDateTime object representing the current day.
 */
export function todayInCalendarDateTime() {
  const todayInTimeStringFromDate = (new Date()).toLocaleString('en-GB', { timeZone: 'Asia/Shanghai' });
  const regex = /^(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})$/;
  const [_, day, month, year, hour, minute] = todayInTimeStringFromDate.match(regex)!;
  return (new CalendarDateTime(
    Number.parseInt(year),
    Number.parseInt(month),
    Number.parseInt(day),
    Number.parseInt(hour),
    Number.parseInt(minute),
    0, // seconds should always be 0
  ));
}
/**
 * @returns Time string in the format of 'YYYY-MM-DDTHH:mm:ss'. Yes, there is a `T` in the middle.
 */
export function todayInTimeString() {
  return todayInCalendarDateTime().toString();
}
/**
 * @returns Time string in the format of 'YYYY-MM-DD HH:mm:ss'.
 */
export function toSeiueString(date: CalendarDateTime) {
  return date.toString().replace('T', ' ');
}

/**
 * Returns Monday of the current week.
 * The time is set to 00:00:00.
 * @returns Time string in the format of 'YYYY-MM-DD HH:mm:ss'.
 */
export function getMondayOfWeek() {
  const date = todayInCalendarDateTime();
  return toSeiueString(startOfWeek(date, 'zh-CN'));
}

/**
 * Returns Sunday two weeks later.
 * The time is set to 23:59:59.
 * @returns Time string in the format of 'YYYY-MM-DD HH:mm:ss'.
 */
export function getSundayTwoWeeksLater() {
  const date = todayInCalendarDateTime();
  return toSeiueString(endOfWeek(date.add({ weeks: 2 }), 'zh-CN').set({ second: 59, minute: 59, hour: 23 }));
}

export function splitCommaSeparatedString(source: string, splitSize: number) {
  const sourceArray = source.split(',');
  const groups = [];
  for (let i = 0; i < sourceArray.length; i += splitSize)
    groups.push(sourceArray.slice(i, i + splitSize).join(','));
  return groups;
}
