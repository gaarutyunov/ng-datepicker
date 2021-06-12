import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { CalendarRow } from './calendar.types';
import moment from 'moment-timezone';
import { weekdays } from './calendar.utils';
import { toUpper } from './calendar.utils';
import { generateCalendar } from './calendar.utils';
import { CalendarCell } from './calendar.types';
import { DatepickerRef } from '../datepicker/datepicker.ref';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  public get date(): moment.Moment {
    return this._date;
  }

  @Input('date')
  public set dateInput(value: moment.MomentInput | undefined) {
    this._date = !!value ? moment(value) : moment();
    this._selectedDate = this._date.clone();
  }

  private readonly _months: string[] = moment.monthsShort();
  @Output()
  public readonly dateChanged: EventEmitter<moment.Moment> = new EventEmitter();
  public readonly weekdays: string[] = weekdays();

  private _date: moment.Moment;
  private _selectedDate: moment.Moment;
  public calendarRows: CalendarRow[] = [];
  public year: number;
  public month: string;

  private _ref?: DatepickerRef;

  constructor(injector: Injector) {
    try {
      this._ref = injector.get(DatepickerRef);
      this._date = !!this._ref?.date ? moment(this._ref!.date!) : moment();
      this._selectedDate = this._date.clone();
    } catch(e) {
      this._date = moment();
      this._selectedDate = moment();
    }

    this.year = this._date.year();

    this._setMonth();
    this._generateCalendar();
  }

  public prevMonth(): void {
    this._date.subtract(1, 'month');
    this._setMonth();
  }

  public nextMonth(): void {
    this._date.add(1, 'month');
    this._setMonth();
  }

  private _setMonth(): void {
    this.month = toUpper(this._months[this._date.month()]);
    this._generateCalendar();
  }

  public setYear(value: number): void {
    this.date.year(value);
    this.year = value;
    this._generateCalendar();
  }

  private _generateCalendar(): void {
    this.calendarRows = generateCalendar(this._date, this._selectedDate);
  }

  public select(cell: CalendarCell): void {
    this._selectedDate = cell.moment.clone();
    this._date = this._selectedDate.clone();
    this.dateChanged.emit(this._selectedDate);
    this._generateCalendar();

    if (this._ref) {
      this._ref.date = this._selectedDate.clone();
      this._ref.close(this._selectedDate.clone());
    }
  }
}
