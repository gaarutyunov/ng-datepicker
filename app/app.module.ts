import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import * as moment from 'moment-timezone';
//@ts-ignore
import locale from 'moment/locale/ru';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from './calendar/calendar.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatepickerComponent } from './datepicker/datepicker.component';

moment.locale('ru', locale);

@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent, CalendarComponent, DatepickerComponent],
  imports: [BrowserModule, FormsModule, OverlayModule],
  entryComponents: [CalendarComponent]
})
export class AppModule {}
