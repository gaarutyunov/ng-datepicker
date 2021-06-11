import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Inject,
  Injector,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
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
      useFactory: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor, OnDestroy {
  protected readonly overlayRef: OverlayRef;
  private readonly _destroy$: Subject<void> = new Subject<void>();

  @ViewChild('input')
  private readonly input?: HTMLInputElement;

  public disabled: boolean = false;

  private _opened: boolean = false;

  private readonly _ref: DatepickerRef;

  private _onChange: (val: any) => void = (_: any) => {};
  private _onTouched: () => void = () => {};

  constructor(
    private readonly overlay: Overlay,
    private readonly injector: Injector
  ) {
    this.overlayRef = this.overlay.create(this._getOverlayConfig());
    this._ref = new DatepickerRef(this.overlayRef);
  }

  public onClick(): void {
    if (this._opened) return;

    this._opened = true;

    const injector = Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: DatepickerRef,
          useValue: this._ref
        }
      ]
    });

    const portal = new ComponentPortal(CalendarComponent, undefined, injector);

    this.overlayRef.attach(portal);

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
    });
  }

  private _hide(): void {
    this.overlayRef.detach();

    this._opened = false;
  }

  writeValue(obj: moment.MomentInput): void {
    this._ref.date = obj;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnDestroy(): void {
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
