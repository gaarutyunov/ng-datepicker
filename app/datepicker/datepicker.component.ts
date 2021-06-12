import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  AfterViewInit,
  Component,
  forwardRef,
  Injector,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { CalendarComponent } from '../calendar/calendar.component';
import moment from 'moment-timezone';
import { DatepickerRef } from './datepicker.ref';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent
  implements ControlValueAccessor, OnDestroy, AfterViewInit {
  private overlayRef: OverlayRef;
  private readonly _destroy$: Subject<void> = new Subject<void>();

  @ViewChild('input')
  public input?: HTMLInputElement;

  public disabled: boolean = false;

  private _opened: boolean = false;

  private _ref: DatepickerRef;

  private _onChange: (val: any) => void = (_: any) => {};
  public onTouched: () => void = () => {};

  private _date?: moment.Moment;
  private _portal?: ComponentPortal<CalendarComponent>;

  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {}

  public ngAfterViewInit(): void {
    this.overlayRef = this.overlay.create(this._getOverlayConfig());
    this._ref = new DatepickerRef(this.overlayRef);
    this._ref.date = this._date;

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: DatepickerRef,
          useValue: this._ref
        }
      ]
    });

    this._portal = new ComponentPortal(CalendarComponent, undefined, injector);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => this._hide());

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(x => x.code === 'Escape'),
        takeUntil(this._destroy$)
      )
      .subscribe(() => this._hide());

    this._ref.afterClosed$.pipe(takeUntil(this._destroy$)).subscribe(x => {
      if (!!x) {
        this._onChange(x);
      }

      this._hide();
    });
  }

  public onClick(): void {
    if (this._opened) return;

    this._opened = true;

    this.overlayRef.attach(this._portal);
  }

  private _hide(): void {
    this.overlayRef.detach();

    this._opened = false;
  }

  public writeValue(obj: moment.MomentInput): void {
    this._date = moment(obj);

    if (this._ref) {
      this._ref.date = this._date;
    }
  }

  public registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.input!)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        }
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();

    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });
  }
}
