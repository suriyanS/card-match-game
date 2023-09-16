import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { MessageService } from 'primeng/api';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [MessageService],
    });
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
