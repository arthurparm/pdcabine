import { Component, computed, input, output } from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';
import type { Service, ServiceId } from '../../../../core/models/service.model';
import { PointerTiltDirective } from '../../../../shared/motion/pointer-tilt.directive';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';

@Component({
  selector: 'app-services',
  imports: [PointerTiltDirective, RevealDirective],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  readonly services = input.required<readonly Service[]>();
  readonly images = input.required<readonly GalleryImage[]>();
  readonly serviceSelected = output<ServiceId>();

  private readonly imagesById = computed(
    () => new Map(this.images().map((image) => [image.id, image] as const)),
  );

  protected imageFor(service: Service): GalleryImage | undefined {
    return this.imagesById().get(service.imageId);
  }

  protected selectService(serviceId: ServiceId): void {
    this.serviceSelected.emit(serviceId);
  }
}
