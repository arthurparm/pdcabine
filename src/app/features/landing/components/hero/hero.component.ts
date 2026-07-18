import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
  readonly companyName = input.required<string>();
  readonly slogan = input.required<string>();
  readonly serviceRegion = input.required<string>();
  readonly whatsappUrl = input.required<string>();
  readonly heroImage = input.required<GalleryImage>();
}
