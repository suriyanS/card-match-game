import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ResultComponent } from './result.component';
import { DataService } from '../service/data.service';
import { DataKeys } from '../service/data-keys';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CommonModule } from '@angular/common';
import {
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';

describe('ResultComponent', () => {
  let component: ResultComponent;
  let fixture: ComponentFixture<ResultComponent>;
  let router: Router;
  let dataService: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ResultComponent,
        RouterTestingModule,
        BrowserAnimationsModule,
        ButtonModule,
        PanelModule,
        CommonModule,
      ],
      providers: [DataService],
    });

    fixture = TestBed.createComponent(ResultComponent);
    component = fixture.componentInstance;
    dataService = TestBed.inject(DataService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when there is no game result', () => {
    spyOn(dataService, 'getData').and.returnValue(undefined);
    spyOn(router, 'navigate');

    component.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should set title and message from game result', () => {
    const gameResult = { title: 'Test Title', message: 'Test Message' };
    spyOn(dataService, 'getData').and.returnValue(gameResult);

    component.ngOnInit();

    expect(component.title).toBe('Test Title');
    expect(component.message).toBe('Test Message');
  });

  it('should restart game', () => {
    spyOn(dataService, 'setData');
    spyOn(router, 'navigate');

    component.restartGame();

    expect(dataService.setData).toHaveBeenCalledWith(
      DataKeys.SHOW_GAME_WINDOW,
      true
    );
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should quit game', () => {
    spyOn(dataService, 'setData');
    spyOn(router, 'navigate');

    component.quitGame();

    expect(dataService.setData).toHaveBeenCalledWith(
      DataKeys.SHOW_GAME_WINDOW,
      false
    );
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
