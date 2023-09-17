import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { DataService } from '../service/data.service';
import { IMAGE_BASE_URL } from '../constants';

describe('CardComponent', () => {
  let fixture: ComponentFixture<CardComponent>;
  let component: CardComponent;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CardComponent, CommonModule],
    });

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
  });

  it('should create the CardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClicked event on card click', () => {
    spyOn(component.cardClicked, 'emit');

    component.value = { id: 1, image: 'example.png' };
    component.isRevealed = false;
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.card');
    cardElement.click();

    expect(component.cardClicked.emit).toHaveBeenCalledWith(component.value);
  });

  it('should not emit cardClicked event if card is revealed', () => {
    spyOn(component.cardClicked, 'emit');

    component.value = { id: 1, image: 'example.png' };
    component.isRevealed = true;
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('.card');
    cardElement.click();

    expect(component.cardClicked.emit).not.toHaveBeenCalled();
  });

  it('should return correct image URL', () => {
    component.value = { id: 1, image: 'example.png' };
    fixture.detectChanges();

    const imageUrl = component.getImageUrl();
    expect(imageUrl).toBe(`${IMAGE_BASE_URL}/example.png`);
  });

  it('should call dataService.getImageUrl with the correct image name', () => {
    const imageName = 'example.png';
    component.value = { id: 1, image: imageName };
    spyOn(dataService, 'getImageUrl').and.returnValue(
      'https://example.com/images/example.png'
    );
    const imageUrl = component.getImageUrl();
    expect(dataService.getImageUrl).toHaveBeenCalledWith(imageName);
    expect(imageUrl).toBe('https://example.com/images/example.png');
  });
});
