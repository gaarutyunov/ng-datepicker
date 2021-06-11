import { Calendar } from "./calendar.types";
import { CalendarCell } from "./calendar.types";
import moment from 'moment-timezone';

export function toUpper(str: string): string {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function weekdays(): string[] {
  return moment.weekdaysShort(true).map(toUpper);
}

export function isToday(date: moment.Moment): boolean {
  const today = moment();

  return date.isSame(today, 'day');
}

export function generatePrefix(startDay: moment.Moment, selected?: moment.Moment): CalendarCell[] {
  let prefix = [];
  const prefixLength = startDay.weekday();

  if (prefixLength > 0) {
    prefix = new Array(prefixLength);
    let prevDate = startDay.clone().subtract(1, 'day');

    for (let i = 0; i < prefixLength; i++) {
      const temp = prevDate.clone();

      prefix[prefixLength - 1 - i] = {
        date: temp.date(),
        moment: temp,
        selected: selected?.isSame(temp, 'day') === true,
        currentMonth: false,
        disabled: false,
        today: isToday(temp)
      };

      prevDate.subtract(1, 'day');
    }
  }

  return prefix;
}

export function generatePostfix(endDay: moment.Moment, selected?: moment.Moment): CalendarCell[] {
  const postfixLength = 6 - endDay.weekday();
  let postfix = [];

  if (postfixLength > 0) {
    postfix = new Array(postfixLength);
    let prevDate = endDay.clone().add(1, 'day');

    for (let i = 0; i < postfixLength; i++) {
      const temp = prevDate.clone();

      postfix[i] = {
        date: temp.date(),
        moment: temp,
        selected: selected?.isSame(temp, 'day') === true,
        currentMonth: false,
        disabled: false,
        today: isToday(temp)
      };

      prevDate.add(1, 'day');
    }
  }

  return postfix;
}

export function generateCalendar(date: moment.Moment, selected?: moment.Moment): Calendar {
  const startDay = date.clone().startOf('month');
  const endDay = date.clone().endOf('month');

  const prefix = generatePrefix(startDay, selected);
  const postfix = generatePostfix(endDay, selected);

  const rows: Calendar = [];

  let temp = startDay.clone();
  let row = [];
  row.push(...prefix);

  const nextMonth = endDay.clone().add(1, 'day');

  while (temp.isBefore(nextMonth, 'day')) {
    const curr = temp.clone();  

    row.push({
      date: curr.date(),
      moment: curr,
      selected: selected?.isSame(temp, 'day') === true,
      currentMonth: true,
      disabled: false,
      today: isToday(temp)
    });

    if (row.length === 7) {
      rows.push(row);
      row = [];
    }

    temp.add(1, 'day');
  }

  if (row.length > 0) {
    rows.push(row);
  }
  
  rows[rows.length - 1]?.push(...postfix);

  return rows;
}