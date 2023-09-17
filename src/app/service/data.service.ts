import { Injectable } from '@angular/core';
import { DataKeys } from './data-keys';
import { IMAGE_BASE_URL } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  data: Map<DataKeys, any> = new Map<DataKeys, any>();
  constructor() {}
  setData(key: DataKeys, value: any): void {
    this.data.set(key, value);
  }

  getData(key: DataKeys): any {
    return this.data.get(key);
  }

  getImageUrl(name: string) {
    return `${IMAGE_BASE_URL}/${name}`;
  }
}
