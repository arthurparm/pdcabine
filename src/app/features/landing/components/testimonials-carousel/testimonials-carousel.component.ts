import { Component, input } from '@angular/core';

@Component({
  selector: 'app-testimonials-carousel',
  templateUrl: './testimonials-carousel.component.html',
  styleUrl: './testimonials-carousel.component.scss'
})
export class TestimonialsCarouselComponent {
  readonly rating = input.required<string>();
  readonly reviewCount = input.required<number>();
  readonly recommendationRate = input.required<string>();
}
