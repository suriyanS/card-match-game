import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
})
export class DialogComponent {
  @Input()
  visible = false;
  @Input()
  title = 'Title';
  @Input()
  content = 'Content';
  @Input()
  buttonLabel = 'Ok';
  @Output()
  buttonClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  onButtonClick() {
    this.buttonClick.emit();
    this.visible = false;
  }
}
