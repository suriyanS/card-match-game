import 'zone.js/dist/zone';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), provideRouter(routes)],
});
