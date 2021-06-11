import { C } from '@angular/cdk/keycodes';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Renderer2
} from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment-timezone';

@Component({
  selector: 'my-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public value: any;
  public formControl: FormControl = new FormControl();

  ngOnInit() {
    this.formControl.valueChanges.subscribe(console.log);
  }
}
