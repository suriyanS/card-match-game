import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { DataKeys } from './data-keys';

describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get data correctly', () => {
    const key = DataKeys.GAME_CATEGORY;
    const value = 'FRUIT';

    service.setData(key, value);

    const retrievedValue = service.getData(key);

    expect(retrievedValue).toEqual(value);
  });

  it('should return undefined for non-existent keys', () => {
    const nonExistentKey = 'NON_EXISTENT_KEY' as DataKeys;

    const retrievedValue = service.getData(nonExistentKey);

    expect(retrievedValue).toBeUndefined();
  });
});
