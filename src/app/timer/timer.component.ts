import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class TimerComponent implements OnInit, OnDestroy {
  seconds = 0;
  minutes = 0;
  timer: any;
  @Input()
  maximumTimeLimit = 60;
  @Output()
  timesUp: EventEmitter<void> = new EventEmitter<void>();
  formattedTime = '00:00';
  constructor() {}

  ngOnInit() {
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes++;
        if (this.minutes >= this.maximumTimeLimit) {
          this.timesUp.emit();
        }
      }
      this.formattedTime = this.formatTime(this.minutes, this.seconds);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  resetTimer() {
    this.seconds = 0;
    this.minutes = 0;
  }

  addPenalty(seconds: number) {
    this.seconds += seconds;
    if (this.seconds >= 60) {
      this.minutes += Math.floor(this.seconds / 60);
      this.seconds %= 60;
      if (this.minutes >= this.maximumTimeLimit) {
        this.timesUp.emit();
      }
    }
    this.formattedTime = this.formatTime(this.minutes, this.seconds);
  }

  formatTime(minutes: number, seconds: number): string {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}
