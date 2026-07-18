import type { ServiceId } from './service.model';

export interface GalleryImage {
  readonly id: string;
  readonly jpegSrc: string;
  readonly webpSrc: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly serviceId?: ServiceId;
}
