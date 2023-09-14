import { Component } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { TimerComponent } from './timer/timer.component';
import { ToastComponent } from './toast/toast.component';
import { ToastService } from './toast/toast.service';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    GridComponent,
    CardComponent,
    TimerComponent,
    ToastComponent,
    NavbarComponent,
  ],
  providers: [MessageService, ToastService],
})
export class AppComponent {
  
 

  constructor() {}

  
}
