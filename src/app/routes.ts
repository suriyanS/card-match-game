import { Routes } from '@angular/router';
import { ResultComponent } from './result/result.component';
import { GridComponent } from './grid/grid.component';

export const routes: Routes = [
  {
    path: '',
    component: GridComponent,
  },
  {
    path: 'result',
    component: ResultComponent,
  },
];
