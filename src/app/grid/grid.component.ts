import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Card, CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { TimerComponent } from '../timer/timer.component';
import { ToastService } from '../toast/toast.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DataService } from '../service/data.service';
import { DataKeys } from '../service/data-keys';
import { GameResult, ResultComponent } from '../result/result.component';
import { Router } from '@angular/router';
import { ListboxModule } from 'primeng/listbox';
import {
  BIRD_AND_INSECT_CARDS,
  FRUIT_CARDS,
  GAME_CATEGORIES,
  VEGETABLE_CARDS,
} from '../constants';
import { ErrorLogService } from '../service/error-log.service';

export interface Category {
  key: string;
  name: string;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TimerComponent,
    CardModule,
    ButtonModule,
    FormsModule,
    ResultComponent,
    ListboxModule,
  ],
})
export class GridComponent {
  cards: Card[] = [];
  revealedCards: number[] = [];
  revealedCardsHistory: Set<number> = new Set<number>();
  matchedPairs: number[] = [];
  @Output()
  isPenaltyApplied: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  isLevelCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(TimerComponent)
  timerComponent!: TimerComponent;
  penalty = 5;
  showGameWindow = false;
  numberOfColumns = 6;
  numberOfRows = 6;
  categories: Category[] = GAME_CATEGORIES;
  selectedCategory!: Category;
  birdAndInsectCards: Card[] = BIRD_AND_INSECT_CARDS;
  fruitCards: Card[] = FRUIT_CARDS;
  vegetableCards: Card[] = VEGETABLE_CARDS;

  constructor(
    private dataService: DataService,
    private router: Router,
    private toastService: ToastService,
    private logService: ErrorLogService
  ) {}

  ngOnInit() {
    this.setDefaults();
  }

  setDefaults() {
    let gameCategory = this.dataService.getData(DataKeys.GAME_CATEGORY);
    this.selectedCategory = gameCategory ? gameCategory : this.categories[0];
    const showGameWindow = this.dataService.getData(DataKeys.SHOW_GAME_WINDOW);
    this.showGameWindow = showGameWindow ? showGameWindow : false;
    if (this.showGameWindow) {
      this.onGameStart();
    }
  }

  revealCard(index: number) {
    if (this.isCardSelectable(index)) {
      this.revealedCards.push(index);

      if (this.revealedCards.length === 2) {
        const [firstIndex, secondIndex] = this.revealedCards;

        if (this.cardsMatch(firstIndex, secondIndex)) {
          this.handleMatchingPairs(firstIndex, secondIndex);
        } else {
          this.handleMismatchedPairs(firstIndex, secondIndex);
        }
        this.resetRevealedCardsAfterDelay();
      }
    }

    if (this.allPairsMatched()) {
      this.onLevelCompleted();
    }
  }

  isCardSelectable(index: number): boolean {
    return (
      this.revealedCards.length < 2 &&
      !this.revealedCards.includes(index) &&
      !this.matchedPairs.includes(index)
    );
  }

  cardsMatch(firstIndex: number, secondIndex: number): boolean {
    return this.cards[firstIndex] === this.cards[secondIndex];
  }

  handleMatchingPairs(firstIndex: number, secondIndex: number) {
    this.matchedPairs.push(firstIndex, secondIndex);
  }

  handleMismatchedPairs(firstIndex: number, secondIndex: number) {
    if (
      this.revealedCardsHistory.has(firstIndex) ||
      this.revealedCardsHistory.has(secondIndex)
    ) {
      this.onPenaltyApplied();
    }
    this.revealedCardsHistory.add(firstIndex);
    this.revealedCardsHistory.add(secondIndex);
  }

  resetRevealedCardsAfterDelay() {
    setTimeout(() => {
      this.revealedCards = [];
    }, 1000);
  }

  allPairsMatched(): boolean {
    return this.matchedPairs.length === this.cards.length;
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
    const gameResult: GameResult = {
      title: `Congratulations!`,
      message: `You finished the game in ${this.timerComponent.minutes}:${this.timerComponent.seconds}`,
    };
    this.dataService.setData(DataKeys.GAME_RESULT, gameResult);
    this.router.navigate(['/result']);
  }

  resetGrid() {
    this.matchedPairs = [];
    this.revealedCards = [];
    this.revealedCardsHistory = new Set<number>();
    this.isLevelCompleted.emit(true);
    this.timerComponent.stopTimer();
  }

  onGameStart() {
    const cards = this.getCards();
    if (cards && cards.length > 0) {
      this.cards = this.generateCards(
        this.numberOfRows,
        this.numberOfColumns,
        cards
      );
      this.showGameWindow = true;
    } else {
      this.throwInvalidConfigurationError();
    }
  }

  getCards(): Card[] {
    let cards: Card[] = [];
    this.dataService.setData(DataKeys.GAME_CATEGORY, this.selectedCategory);
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
      this.throwInvalidConfigurationError();
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
    const gameResult: GameResult = {
      title: `Game Over! Time's Up`,
      message: `You have exceeded the game time limit ${this.timerComponent.minutes}:${this.timerComponent.seconds}`,
    };
    this.dataService.setData(DataKeys.GAME_RESULT, gameResult);
    this.router.navigate(['/result']);
  }

  throwInvalidConfigurationError() {
    this.toastService.showError(
      'Oops! Something went wrong. Please try again later.'
    );
    this.logService.logError(
      'Invalid configuration: Ensure an even number of cards and enough unique cards for the grid.'
    );
  }

  getImageUrl(name: string) {
    return this.dataService.getImageUrl(name);
  }
}
