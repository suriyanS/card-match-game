import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Card {
  id: number;
  image: string;
}
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class CardComponent {
  @Input()
  value!: Card;
  @Input()
  isRevealed!: boolean;
  @Output() cardClicked = new EventEmitter<Card>();

  constructor() {}

  onCardClick() {
    if (!this.isRevealed) {
      this.cardClicked.emit(this.value);
    }
  }

  getImageUrl() {
    return `assets/images/${this.value.image}`;
  }
}
