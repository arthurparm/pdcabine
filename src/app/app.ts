import { Component } from '@angular/core';
import { LandingPageComponent } from './features/landing/landing-page.component';

@Component({
  selector: 'app-root',
  imports: [LandingPageComponent],
  template: '<app-landing-page />',
  styleUrl: './app.scss',
})
export class App {}
