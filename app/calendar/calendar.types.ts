export interface CalendarCell {
  date: number;
  moment: moment.Moment;
  selected: boolean;
  currentMonth: boolean;
  disabled: boolean;
  today: boolean;
}

export type CalendarRow = CalendarCell[];

export type Calendar = CalendarRow[];
