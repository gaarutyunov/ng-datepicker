import { C } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment-timezone';

@Component({
  selector: 'my-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}

  public set value(val: any) {
    console.log(val);

    this._value = val;
  }

  public get value(): any {
    return this._value;
  }

  private _value: any;

  ngOnInit() {}
}
