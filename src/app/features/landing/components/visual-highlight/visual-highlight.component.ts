import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';

@Component({
  selector: 'app-visual-highlight',
  templateUrl: './visual-highlight.component.html',
  styleUrl: './visual-highlight.component.scss'
})
export class VisualHighlightComponent {
  readonly image = input.required<GalleryImage>();
}
