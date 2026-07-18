import { Component, input } from '@angular/core';
import type { Testimonial } from '../../../../core/models/testimonial.model';

@Component({
  selector: 'app-testimonials-carousel',
  templateUrl: './testimonials-carousel.component.html',
  styleUrl: './testimonials-carousel.component.scss'
})
export class TestimonialsCarouselComponent {
  readonly testimonials = input.required<readonly Testimonial[]>();
}
