import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';

export interface HighlightImages {
  readonly primary: GalleryImage;
  readonly secondary: GalleryImage;
  readonly tertiary: GalleryImage;
}

@Component({
  selector: 'app-visual-highlight',
  imports: [RevealDirective],
  templateUrl: './visual-highlight.component.html',
  styleUrl: './visual-highlight.component.scss',
})
export class VisualHighlightComponent {
  readonly images = input.required<HighlightImages>();
}
