import { Component, input } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';

@Component({
  selector: 'app-experience-gallery',
  templateUrl: './experience-gallery.component.html',
  styleUrl: './experience-gallery.component.scss'
})
export class ExperienceGalleryComponent {
  readonly images = input.required<readonly GalleryImage[]>();
}
