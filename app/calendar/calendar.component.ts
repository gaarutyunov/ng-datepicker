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

  private _date = moment();
  private _selectedDate = moment();
  public calendarRows: CalendarRow[] = [];
  public year: number = this._date.year();
  public month: string;

  constructor(injector: Injector) {
    try {
      const ref = injector.get(DatepickerRef);
      this._date = !!ref?.date ? moment(ref!.date!) : moment();
    } catch(e) {
      // do nothing
    }

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
  }
}
