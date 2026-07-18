export interface GalleryImage {
  readonly id: string;
  readonly jpegSrc: string;
  readonly webpSrc: string;
  readonly webpSrcSet: string;
  readonly cardWebpSrcSet?: string;
  readonly alt: string;
  readonly caption: string;
  readonly width: number;
  readonly height: number;
  readonly objectPosition: string;
  readonly gridSpan: 'standard' | 'wide' | 'tall' | 'feature';
}
