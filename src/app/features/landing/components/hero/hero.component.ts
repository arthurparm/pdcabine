import { IMAGE_LOADER, NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';
import { PointerTiltDirective } from '../../../../shared/motion/pointer-tilt.directive';

export interface HeroImages {
  readonly primary: GalleryImage;
  readonly secondary: GalleryImage;
  readonly tertiary: GalleryImage;
}

interface LocalImageLoaderConfig {
  readonly src: string;
  readonly width?: number;
  readonly loaderParams?: Readonly<Record<string, unknown>>;
}

export function localResponsiveImageLoader(config: LocalImageLoaderConfig): string {
  const originalWidth = config.loaderParams?.['originalWidth'];
  if (!config.width || typeof originalWidth !== 'number' || config.width >= originalWidth) {
    return config.src;
  }

  const extensionIndex = config.src.lastIndexOf('.');
  return `${config.src.slice(0, extensionIndex)}-${config.width}${config.src.slice(extensionIndex)}`;
}

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage, PointerTiltDirective],
  providers: [{ provide: IMAGE_LOADER, useValue: localResponsiveImageLoader }],
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
