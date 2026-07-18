import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';
import { PointerTiltDirective } from '../../../../shared/motion/pointer-tilt.directive';

export interface HeroImages {
  readonly primary: GalleryImage;
  readonly secondary: GalleryImage;
  readonly tertiary: GalleryImage;
}

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, PointerTiltDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly companyName = input.required<string>();
  readonly serviceRegion = input.required<string>();
  readonly logoPath = input.required<string>();
  readonly logoSrcSet = input.required<string>();
  readonly images = input.required<HeroImages>();
}
