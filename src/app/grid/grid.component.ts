import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Card, CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '../timer/timer.component';
import { ToastService } from '../toast/toast.service';
import { DialogComponent } from '../dialog/dialog.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TimerComponent,
    DialogComponent,
    CardModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
  ],
})
export class GridComponent {
  cards: Card[] = [];
  revealedCards: number[] = [];
  revealedCardsHistory: number[] = [];
  matchedPairs: number[] = [];
  @Output()
  isPenaltyApplied: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  isLevelCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(TimerComponent)
  timerComponent!: TimerComponent;
  dialogTitle = 'Congratulations!';
  dialogContent = '';
  penalty = 5;
  showDialog = false;
  dialogButtonLabel = 'Play Again';
  showGameWindow = false;
  selectedCategory: any = null;
  numberOfColumns = 6;
  numberOfRows = 6;
  categories: any[] = [
    { name: 'Birds and Insects', key: 'BI' },
    { name: 'Fruits', key: 'FR' },
    { name: 'Vegetables', key: 'VG' },
  ];

  birdAndInsectCards: Card[] = [
    { id: 1, image: 'bird.png' },
    { id: 2, image: 'dove.png' },
    { id: 3, image: 'duck.png' },
    { id: 4, image: 'flamingo.png' },
    { id: 5, image: 'flying-duck.png' },
    { id: 6, image: 'hummingbird.png' },
    { id: 7, image: 'peacock.png' },
    { id: 8, image: 'seagull.png' },
    { id: 9, image: 'swan.png' },
    { id: 10, image: 'woodpecker.png' },
    { id: 11, image: 'ant.png' },
    { id: 12, image: 'bumblebee.png' },
    { id: 13, image: 'butterfly.png' },
    { id: 14, image: 'caterpillar.png' },
    { id: 15, image: 'dragonfly.png' },
    { id: 16, image: 'fly.png' },
    { id: 17, image: 'grasshopper.png' },
    { id: 18, image: 'hornet.png' },
  ];

  fruitCards: Card[] = [
    { id: 1, image: 'apple-fruit.png' },
    { id: 2, image: 'apricot.png' },
    { id: 3, image: 'avocado.png' },
    { id: 4, image: 'banana.png' },
    { id: 5, image: 'citrus.png' },
    { id: 6, image: 'coconut.png' },
    { id: 7, image: 'date-fruit.png' },
    { id: 8, image: 'dragon-fruit.png' },
    { id: 9, image: 'half-citrus.png' },
    { id: 10, image: 'jackfruit.png' },
    { id: 11, image: 'mango.png' },
    { id: 12, image: 'mangosteen.png' },
    { id: 13, image: 'peeled-banana.png' },
    { id: 14, image: 'pineapple.png' },
    { id: 15, image: 'plaintains.png' },
    { id: 16, image: 'pomegranate.png' },
    { id: 17, image: 'rambun.png' },
    { id: 18, image: 'watermelon.png' },
  ];

  vegetableCards = [
    { id: 1, image: 'artichoke.png' },
    { id: 2, image: 'carrot.png' },
    { id: 3, image: 'cauliflower.png' },
    { id: 4, image: 'celery.png' },
    { id: 5, image: 'chard.png' },
    { id: 6, image: 'chili-pepper.png' },
    { id: 7, image: 'collard-greens.png' },
    { id: 8, image: 'corn.png' },
    { id: 9, image: 'finocchio.png' },
    { id: 10, image: 'gailan.png' },
    { id: 11, image: 'group-of-vegetables.png' },
    { id: 12, image: 'pumpkin.png' },
    { id: 13, image: 'soy.png' },
    { id: 14, image: 'spinach.png' },
    { id: 15, image: 'squash.png' },
    { id: 16, image: 'sweet-potato.png' },
    { id: 17, image: 'you-choy.png' },
    { id: 18, image: 'zucchini.png' },
  ];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.selectedCategory = this.categories[0];
  }

  revealCard(index: number) {
    if (this.revealedCards.length < 2 && !this.revealedCards.includes(index)) {
      this.revealedCards.push(index);

      if (this.revealedCards.length === 2) {
        const [firstIndex, secondIndex] = this.revealedCards;

        if (this.cards[firstIndex] === this.cards[secondIndex]) {
          this.matchedPairs.push(firstIndex, secondIndex);
        } else if (
          this.revealedCardsHistory.includes(firstIndex) ||
          this.revealedCardsHistory.includes(secondIndex)
        ) {
          this.onPenaltyApplied();
        } else {
          this.revealedCardsHistory.push(firstIndex);
          this.revealedCardsHistory.push(secondIndex);
        }

        setTimeout(() => {
          this.revealedCards = [];
        }, 1000);
      }
    }
    if (this.matchedPairs.length === this.cards.length) {
      this.onLevelCompleted();
    }
  }

  isCardRevealed(index: number): boolean {
    return (
      this.revealedCards.includes(index) || this.matchedPairs.includes(index)
    );
  }

  shuffleCards(cards: any[]) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  onPenaltyApplied() {
    this.isPenaltyApplied.emit(true);
    this.timerComponent.addPenalty(this.penalty);
    this.toastService.showWarn(`Penalty: +${this.penalty} seconds`);
  }

  onLevelCompleted() {
    this.resetGrid();
    this.dialogContent = `You finished the game in ${this.timerComponent.minutes}:${this.timerComponent.seconds}`;
    this.showDialog = true;
  }

  resetGrid() {
    this.matchedPairs = [];
    this.revealedCards = [];
    this.revealedCardsHistory = [];
    this.isLevelCompleted.emit(true);
    this.timerComponent.stopTimer();
  }

  onDialogButtonClick() {
    this.timerComponent.resetTimer();
    this.timerComponent.startTimer();
  }

  onGameStart() {
    this.cards = this.generateCards(
      this.numberOfRows,
      this.numberOfColumns,
      this.getCards()
    );
    this.showGameWindow = true;
  }

  getCards(): Card[] {
    let cards: Card[] = [];
    switch (this.selectedCategory.key) {
      case 'BI':
        cards = this.birdAndInsectCards;
        break;
      case 'VG':
        cards = this.vegetableCards;
        break;
      case 'FR':
        cards = this.fruitCards;
        break;
      default:
        return cards;
    }
    return cards;
  }

  onGameStop() {
    this.resetGrid();
    this.showGameWindow = false;
  }

  generateCards(numRows: number, numCols: number, cardArray: any[]) {
    const totalCards = numRows * numCols;
    if (totalCards % 2 !== 0 || cardArray.length < totalCards / 2) {
      this.toastService.showError(
        'Oops! Something went wrong. Please try again later.'
      );
      throw new Error(
        'Invalid configuration: Ensure an even number of cards and enough unique cards for the grid.'
      );
    }

    const selectedCards: any[] = [];
    for (let i = 0; i < totalCards / 2; i++) {
      selectedCards.push(cardArray[i]);
    }

    const allCards = [...selectedCards, ...selectedCards];
    this.shuffleCards(allCards);

    return allCards;
  }

  onTimesUp() {
    this.resetGrid();
    this.dialogContent = `You have exceeded the game time limit ${this.timerComponent.minutes}:${this.timerComponent.seconds}`;
    this.dialogTitle = `Game Over! Time's Up'`;
    this.showDialog = true;
  }
}
