import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { ToastService } from '../toast/toast.service';
import { DataService } from '../service/data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, provideRouter } from '@angular/router';
import { DataKeys } from '../service/data-keys';
import {
  BIRD_AND_INSECT_CARDS,
  FRUIT_CARDS,
  GAME_CATEGORIES,
  VEGETABLE_CARDS,
} from '../constants';
import { MessageService } from 'primeng/api';
import { TimerComponent } from '../timer/timer.component';
import { ErrorLogService } from '../service/error-log.service';
import { routes } from '../routes';

const MOCK_CARDS = [
  { id: 1, image: 'mango.png' },
  { id: 2, image: 'apple.png' },
  { id: 1, image: 'mango.png' },
  { id: 2, image: 'apple.png' },
];

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let toastService: ToastService;
  let dataService: DataService;
  let logService: ErrorLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MessageService,
        ErrorLogService,
        ToastService,
        DataService,
        provideRouter(routes),
      ],
      imports: [GridComponent, RouterTestingModule],
    });
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.timerComponent =
      TestBed.createComponent(TimerComponent).componentInstance;
    toastService = TestBed.inject(ToastService);
    dataService = TestBed.inject(DataService);
    logService = TestBed.inject(ErrorLogService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set default values on ngOnInit', () => {
    component.ngOnInit();

    expect(component.selectedCategory).toBeDefined();
    expect(component.showGameWindow).toBe(false);
  });

  it('should set default values when no data is available', () => {
    spyOn(dataService, 'getData').and.returnValue(null);
    component.setDefaults();
    expect(component.selectedCategory).toEqual(component.categories[0]);
    expect(component.showGameWindow).toBeFalse();
  });

  it('should set values from data when available', () => {
    const mockCategory = GAME_CATEGORIES[0];
    const mockShowGameWindow = true;
    const getDataSpy = spyOn(dataService, 'getData');
    getDataSpy.withArgs(DataKeys.GAME_CATEGORY).and.returnValue(mockCategory);
    getDataSpy
      .withArgs(DataKeys.SHOW_GAME_WINDOW)
      .and.returnValue(mockShowGameWindow);

    component.setDefaults();
    expect(component.selectedCategory).toEqual(mockCategory);
    expect(component.showGameWindow).toBe(mockShowGameWindow);
  });

  it('should reveal a card and handle matching pairs', () => {
    component.cards = MOCK_CARDS;
    spyOn(component, 'isCardSelectable').and.returnValue(true);
    spyOn(component, 'cardsMatch').and.returnValue(true);
    spyOn(component, 'handleMatchingPairs');
    spyOn(component, 'resetRevealedCardsAfterDelay');
    spyOn(component, 'onLevelCompleted');
    spyOn(component, 'allPairsMatched').and.returnValue(true);

    component.revealedCards = [];
    component.revealCard(0);
    component.revealCard(2);

    expect(component.handleMatchingPairs).toHaveBeenCalledWith(0, 2);
    expect(component.resetRevealedCardsAfterDelay).toHaveBeenCalled();
    component.revealCard(1);
    component.revealCard(3);
    expect(component.allPairsMatched).toHaveBeenCalled();
    expect(component.onLevelCompleted).toHaveBeenCalled();
  });

  it('should reveal a card and handle mismatched pairs', () => {
    component.cards = MOCK_CARDS;
    spyOn(component, 'isCardSelectable').and.returnValue(true);
    spyOn(component, 'cardsMatch').and.returnValue(false);
    spyOn(component, 'handleMismatchedPairs');
    spyOn(component, 'resetRevealedCardsAfterDelay');
    spyOn(component, 'onLevelCompleted');

    component.revealedCards = [];
    component.revealCard(0);
    component.revealCard(1);

    expect(component.handleMismatchedPairs).toHaveBeenCalledWith(0, 1);
    expect(component.resetRevealedCardsAfterDelay).toHaveBeenCalled();
    expect(component.onLevelCompleted).not.toHaveBeenCalled();
  });

  it('should not reveal a card when it is not selectable', () => {
    component.cards = MOCK_CARDS;
    spyOn(component, 'isCardSelectable').and.returnValue(false);
    spyOn(component, 'cardsMatch');
    spyOn(component, 'handleMatchingPairs');
    spyOn(component, 'handleMismatchedPairs');
    spyOn(component, 'resetRevealedCardsAfterDelay');
    spyOn(component, 'onLevelCompleted');
    component.revealedCards = [];
    component.revealCard(0);
    expect(component.cardsMatch).not.toHaveBeenCalled();
    expect(component.handleMatchingPairs).not.toHaveBeenCalled();
    expect(component.handleMismatchedPairs).not.toHaveBeenCalled();
    expect(component.resetRevealedCardsAfterDelay).not.toHaveBeenCalled();
    expect(component.onLevelCompleted).not.toHaveBeenCalled();
  });

  it('should handle level completion when all pairs are matched', () => {
    spyOn(component, 'isCardSelectable').and.returnValue(true);
    spyOn(component, 'cardsMatch').and.returnValue(true);
    spyOn(component, 'handleMatchingPairs');
    spyOn(component, 'resetRevealedCardsAfterDelay');
    spyOn(component, 'onLevelCompleted');
    spyOn(component, 'allPairsMatched').and.returnValue(true);
    component.revealedCards = [];
    component.revealCard(0);
    component.revealCard(1);
    expect(component.onLevelCompleted).toHaveBeenCalled();
  });

  it('should generate cards and set showGameWindow to true when valid cards are available', () => {
    spyOn(component, 'getCards').and.returnValue(MOCK_CARDS);
    spyOn(component, 'generateCards').and.returnValue([
      ...MOCK_CARDS,
      ...MOCK_CARDS,
    ]);
    component.onGameStart();
    expect(component.cards).toEqual([...MOCK_CARDS, ...MOCK_CARDS]);
    expect(component.showGameWindow).toBeTrue();
  });

  it('should throw an error when no valid cards are available - generateCards()', () => {
    const errorSpy = spyOn(component, 'throwInvalidConfigurationError');
    component.generateCards(3, 5, MOCK_CARDS);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('should throw an error when no valid cards are available - getCards()', () => {
    spyOn(component, 'getCards').and.returnValue([]);
    spyOn(component, 'throwInvalidConfigurationError');
    component.onGameStart();
    expect(component.throwInvalidConfigurationError).toHaveBeenCalled();
  });

  it('should set the selected category in data service and return the appropriate cards', () => {
    component.selectedCategory = GAME_CATEGORIES[0];
    component.birdAndInsectCards = BIRD_AND_INSECT_CARDS;
    component.fruitCards = FRUIT_CARDS;
    component.vegetableCards = VEGETABLE_CARDS;
    const setadataSpy = spyOn(dataService, 'setData');
    const categoryOneResult = component.getCards();
    expect(setadataSpy).toHaveBeenCalledWith(
      DataKeys.GAME_CATEGORY,
      component.selectedCategory
    );
    expect(categoryOneResult).toEqual(BIRD_AND_INSECT_CARDS);

    component.selectedCategory = GAME_CATEGORIES[1];
    const categoryTwoResult = component.getCards();
    expect(setadataSpy).toHaveBeenCalledWith(
      DataKeys.GAME_CATEGORY,
      component.selectedCategory
    );
    expect(categoryTwoResult).toEqual(FRUIT_CARDS);

    component.selectedCategory = GAME_CATEGORIES[2];
    const categoryThreeResult = component.getCards();
    expect(setadataSpy).toHaveBeenCalledWith(
      DataKeys.GAME_CATEGORY,
      component.selectedCategory
    );
    expect(categoryThreeResult).toEqual(VEGETABLE_CARDS);
  });

  it('should return an empty array when an unknown category is selected', () => {
    component.selectedCategory = { key: 'UNKNOWN', name: 'UNKNOWN' };
    const result = component.getCards();
    expect(result).toEqual([]);
  });

  it('should allow selecting a card', () => {
    component.revealedCards = [];
    component.matchedPairs = [];
    component.revealedCardsHistory = new Set<number>();

    const isSelectable = component.isCardSelectable(0);

    expect(isSelectable).toBe(true);
  });

  it('should prevent selecting the same card twice', () => {
    component.revealedCards = [0];
    component.matchedPairs = [];
    component.revealedCardsHistory = new Set<number>();

    const isSelectable = component.isCardSelectable(0);

    expect(isSelectable).toBe(false);
  });

  it('should prevent selecting more than two cards', () => {
    component.revealedCards = [0, 1];
    component.matchedPairs = [];
    component.revealedCardsHistory = new Set<number>();

    const isSelectable = component.isCardSelectable(2);

    expect(isSelectable).toBe(false);
  });

  it('should handle matching pairs correctly', () => {
    component.matchedPairs = [];
    const firstIndex = 0;
    const secondIndex = 1;

    component.handleMatchingPairs(firstIndex, secondIndex);

    expect(component.matchedPairs).toEqual([firstIndex, secondIndex]);
  });

  it('should handle mismatched pairs correctly with no penalty', () => {
    component.revealedCardsHistory = new Set<number>();
    const firstIndex = 0;
    const secondIndex = 1;
    const onPenaltyAppliedSpy = spyOn(component, 'onPenaltyApplied');

    component.handleMismatchedPairs(firstIndex, secondIndex);

    expect(onPenaltyAppliedSpy).not.toHaveBeenCalled();
    expect(component.revealedCardsHistory).toContain(firstIndex);
    expect(component.revealedCardsHistory).toContain(secondIndex);
  });

  it('should handle mismatched pairs correctly with penalty', () => {
    component.revealedCardsHistory.add(0);
    const firstIndex = 0;
    const secondIndex = 1;
    const onPenaltyAppliedSpy = spyOn(component, 'onPenaltyApplied');

    component.handleMismatchedPairs(firstIndex, secondIndex);

    expect(onPenaltyAppliedSpy).toHaveBeenCalled();
    expect(component.revealedCardsHistory).toContain(0);
    expect(component.revealedCardsHistory).toContain(secondIndex);
  });

  it('should reset revealed cards after a delay', fakeAsync(() => {
    component.revealedCards = [0, 1];

    component.resetRevealedCardsAfterDelay();

    tick(1001);

    expect(component.revealedCards).toEqual([]);
  }));

  it('should check if all pairs are matched', () => {
    component.matchedPairs = [0, 1, 2, 3];
    component.cards = MOCK_CARDS;

    const allPairsMatched = component.allPairsMatched();

    expect(allPairsMatched).toBe(true);
  });

  it('should reveal a card and check for matching pairs', fakeAsync(() => {
    const onPenaltyAppliedSpy = spyOn(component, 'onPenaltyApplied');
    component.revealedCards = [];
    component.matchedPairs = [];
    component.revealedCardsHistory = new Set<number>();
    component.cards = MOCK_CARDS;

    component.revealCard(0);
    component.revealCard(1);

    expect(component.matchedPairs).toEqual([]);
    expect(component.revealedCards.length).toBe(2);
    expect(onPenaltyAppliedSpy).not.toHaveBeenCalled();
    tick(1001);
    fixture.detectChanges();

    expect(component.revealedCards.length).toBe(0);
  }));

  it('should apply penalty and show warning', () => {
    const addPenaltySpy = spyOn(component.timerComponent, 'addPenalty');
    const showWarnSpy = spyOn(toastService, 'showWarn');

    component.onPenaltyApplied();

    expect(addPenaltySpy).toHaveBeenCalledWith(component.penalty);
    expect(showWarnSpy).toHaveBeenCalledWith(
      `Penalty: +${component.penalty} seconds`
    );
  });

  it('should complete the level', () => {
    component.timerComponent.minutes = 1;
    component.timerComponent.seconds = 30;
    component.timerComponent.formattedTime =
      component.timerComponent.formatTime(1, 30);
    component.resetGrid();
    const gameResult = {
      title: 'Congratulations!',
      message: 'You finished the game in 1:30',
    };
    const setDataSpy = spyOn(dataService, 'setData');
    const stopTimerSpy = spyOn(component.timerComponent, 'stopTimer');
    const showErrorSpy = spyOn(toastService, 'showError');

    component.onLevelCompleted();

    expect(setDataSpy).toHaveBeenCalledWith(DataKeys.GAME_RESULT, gameResult);
    expect(component.showGameWindow).toBe(false);
    expect(stopTimerSpy).toHaveBeenCalled();
    expect(showErrorSpy).not.toHaveBeenCalled();
  });

  it('should reset grid', () => {
    component.matchedPairs = [0, 1];
    component.revealedCards = [2, 3];
    component.revealedCardsHistory.add(4);
    component.revealedCardsHistory.add(5);
    const stopTimerSpy = spyOn(component.timerComponent, 'stopTimer');
    const emitSpy = spyOn(component.isLevelCompleted, 'emit');

    component.resetGrid();

    expect(component.matchedPairs.length).toBe(0);
    expect(component.revealedCards.length).toBe(0);
    expect(component.revealedCardsHistory.size).toBe(0);
    expect(stopTimerSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should generate cards correctly', () => {
    const numRows = 6;
    const numCols = 6;
    const cardArray = FRUIT_CARDS;
    component.selectedCategory = GAME_CATEGORIES[0];
    const cards = component.generateCards(numRows, numCols, cardArray);
    const expectedNumberOfCards = numRows * numCols;
    expect(cards.length).toBeGreaterThanOrEqual(expectedNumberOfCards);
  });

  it('should handle times up', () => {
    component.timerComponent.formattedTime =
      component.timerComponent.formatTime(1, 0);
    component.timerComponent.maximumTimeLimit = 1;
    component.timerComponent.minutes = 1;
    component.timerComponent.seconds = 0;
    const gameResult = {
      title: `Game Over! Time's Up`,
      message: `You have exceeded the game time limit 1:0`,
    };
    const setDataSpy = spyOn(dataService, 'setData');
    component.onTimesUp();
    expect(setDataSpy).toHaveBeenCalledWith(DataKeys.GAME_RESULT, gameResult);
  });

  it('should throw an error for invalid configuration', () => {
    const showErrorSpy = spyOn(toastService, 'showError');
    const logSpy = spyOn(logService, 'logError');
    component.throwInvalidConfigurationError();
    expect(showErrorSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('should reset the grid and set showGameWindow to false', () => {
    component.showGameWindow = true;
    spyOn(component, 'resetGrid');
    component.onGameStop();
    expect(component.resetGrid).toHaveBeenCalled();
    expect(component.showGameWindow).toBeFalse();
  });

  it('should return true if the card is revealed or matched', () => {
    component.revealedCards = [1, 2, 3];
    component.matchedPairs = [4, 5];
    expect(component.isCardRevealed(1)).toBeTrue();
    expect(component.isCardRevealed(4)).toBeTrue();
  });

  it('should return false if the card is not revealed or matched', () => {
    component.revealedCards = [1, 2, 3];
    component.matchedPairs = [4, 5];
    expect(component.isCardRevealed(0)).toBeFalse();
    expect(component.isCardRevealed(6)).toBeFalse();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
