import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let toastService: ToastService;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        MessageService,
        ToastService,
        { provide: MessageService, useValue: spy },
      ],
    });

    toastService = TestBed.inject(ToastService);
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  it('should be created', () => {
    expect(toastService).toBeTruthy();
  });

  it('should show success toast', () => {
    const message = 'Success Message';
    
    toastService.showSuccess(message);
    
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  });

  it('should show info toast', () => {
    const message = 'Info Message';
    
    toastService.showInfo(message);
    
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  });

  it('should show warn toast', () => {
    const message = 'Warn Message';
    
    toastService.showWarn(message);
    
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warn',
      detail: message,
    });
  });

  it('should show error toast', () => {
    const message = 'Error Message';
    
    toastService.showError(message);
    
    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  });
});
