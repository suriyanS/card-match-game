import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../service/data.service';
import { DataKeys } from '../service/data-keys';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';

export interface GameResult {
  title: string;
  message: string;
}

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule, PanelModule],
})
export class ResultComponent implements OnInit {
  title = '';
  message = '';
  constructor(private dataService: DataService, private router: Router) {}
  ngOnInit(): void {
    const result = this.dataService.getData(DataKeys.GAME_RESULT) as GameResult;
    if (!result || !result.title || !result.message) {
      this.router.navigate(['']);
    } else {
      this.title = result.title;
      this.message = result.message;
    }
  }
  restartGame() {
    this.dataService.setData(DataKeys.SHOW_GAME_WINDOW, true);
    this.router.navigate(['']);
  }

  quitGame() {
    this.dataService.setData(DataKeys.SHOW_GAME_WINDOW, false);
    this.router.navigate(['']);
  }
}
