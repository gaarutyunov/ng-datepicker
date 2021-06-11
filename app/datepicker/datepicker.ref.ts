import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';

export class DatepickerRef {
  private readonly _afterClosed$: Subject<any> = new Subject();
  public readonly afterClosed$: Observable<
    any
  > = this._afterClosed$.asObservable();
  public date?: moment.MomentInput;

  constructor(private readonly overlayRef: OverlayRef) {}

  public close(date: moment.Moment): void {
    this.overlayRef.detach();
    this._afterClosed$.next(date);
    this._afterClosed$.complete();
  }
}
