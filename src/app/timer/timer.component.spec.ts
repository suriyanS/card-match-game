import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TimerComponent } from './timer.component';
import { EventEmitter } from '@angular/core';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimerComponent],
    });

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    clearInterval(component.timer);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start timer and emit timesUp event when maximumTimeLimit is reached', () => {
    component.maximumTimeLimit = 1;
    spyOn(component.timesUp, 'emit');

    component.startTimer();
    setTimeout(() => {
      expect(component.timesUp.emit).toHaveBeenCalled();
      component.stopTimer();
    }, 1000);
  });

  it('should reset timer', () => {
    component.seconds = 30;
    component.minutes = 2;

    component.resetTimer();

    expect(component.seconds).toBe(0);
    expect(component.minutes).toBe(0);
  });

  it('should add penalty time correctly', () => {
    component.timesUp = new EventEmitter<void>();
    component.seconds = 30;
    component.minutes = 2;
    component.maximumTimeLimit = 5;
    const emitSpy = spyOn(component.timesUp, 'emit');
    component.addPenalty(120);

    setTimeout(() => {
      component.addPenalty(120);
      fixture.detectChanges();

      expect(component.seconds).toBe(30);
      expect(component.minutes).toBe(4);
      expect(emitSpy).toHaveBeenCalled();
    }, 1000);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(5, 30)).toBe('05:30');
    expect(component.formatTime(0, 5)).toBe('00:05');
  });

  it('should stop timer on destroy', () => {
    spyOn(window, 'clearInterval');

    component.ngOnDestroy();

    expect(window.clearInterval).toHaveBeenCalledWith(component.timer);
  });

  it('should increment seconds and format time correctly', () => {
    component.seconds = 0;
    component.minutes = 0;
    component.maximumTimeLimit = 5;
    component.startTimer();
    setTimeout(() => {
      expect(component.seconds).toBe(2);
      expect(component.formattedTime).toBe('00:02');
    }, 2000);
  });

  it('should increment minutes and emit timesUp event when maximumTimeLimit is reached', () => {
    component.seconds = 58;
    component.minutes = 4;
    component.maximumTimeLimit = 5;
    const timesUpSpy = spyOn(component.timesUp, 'emit');
    component.startTimer();
    setTimeout(() => {
      expect(component.minutes).toBe(5);
      expect(timesUpSpy).toHaveBeenCalled();
    }, 2000);
  });

  it('should increment minutes and emit timesUp event when maximumTimeLimit is reached', () => {
    component.seconds = 0;
    component.minutes = 4;
    component.maximumTimeLimit = 5;
    const timesUpSpy = spyOn(component.timesUp, 'emit');
    component.addPenalty(120);
    expect(component.minutes).toBe(6);
    expect(timesUpSpy).toHaveBeenCalled();
    expect(component.formattedTime).toBe('06:00');
  });

  it('should format time with leading zeros correctly', () => {
    const minutes = 10;
    const seconds = 14;
    const formattedTime = component.formatTime(minutes, seconds);
    expect(formattedTime).toBe('10:14');
  });

  it('should format single-digit time values with leading zeros', () => {
    const minutes = 3;
    const seconds = 8;
    const formattedTime = component.formatTime(minutes, seconds);
    expect(formattedTime).toBe('03:08');
  });

  it('should reset the seconds to zero', fakeAsync(() => {
    component.seconds = 59;
    component.minutes = 59;
    component.maximumTimeLimit = 60;
    component.startTimer();
    tick(1000);
    expect(component.seconds).toBe(0);
    component.stopTimer();
  }));
});
