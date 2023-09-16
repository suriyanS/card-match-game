import { Component } from '@angular/core';
import { GridComponent } from './grid/grid.component';
import { CardComponent } from './card/card.component';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './toast/toast.component';
import { ToastService } from './toast/toast.service';
import { MessageService } from 'primeng/api';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { DataService } from './service/data.service';
import { ErrorLogService } from './service/error-log.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    GridComponent,
    CardComponent,
    ToastComponent,
    NavbarComponent,
    RouterOutlet,
  ],
  providers: [DataService, ErrorLogService, MessageService, ToastService],
})
export class AppComponent {
  constructor() {}
}
