import { TestBed } from '@angular/core/testing';
import { ErrorLogService } from './error-log.service';

describe('ErrorLogService', () => {
  let service: ErrorLogService;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorLogService],
    });
    service = TestBed.inject(ErrorLogService);
    consoleErrorSpy = spyOn(console, 'error').and.stub();
  });

  it('should log an error message to the console', () => {
    const errorMessage = 'This is an error message';
    service.logError(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(errorMessage);
  });

  afterEach(() => {
    consoleErrorSpy.and.callThrough();
  });
});
