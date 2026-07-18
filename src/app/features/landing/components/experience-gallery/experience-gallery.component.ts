import { DOCUMENT } from '@angular/common';
import {
  AnimationCallbackEvent,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import type { GalleryImage } from '../../../../core/models/gallery-image.model';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';

@Component({
  selector: 'app-experience-gallery',
  imports: [RevealDirective],
  templateUrl: './experience-gallery.component.html',
  styleUrl: './experience-gallery.component.scss',
})
export class ExperienceGalleryComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private triggerElement?: HTMLElement;
  private touchStartX?: number;
  private touchStartY?: number;
  private navigationRequest = 0;
  private closing = false;
  private readonly decodedSources = new Set<string>();

  @ViewChild('lightbox') private lightbox?: ElementRef<HTMLDialogElement>;
  @ViewChild('closeButton') private closeButton?: ElementRef<HTMLButtonElement>;

  readonly images = input.required<readonly GalleryImage[]>();
  protected readonly activeIndex = signal<number | null>(null);
  protected readonly activeImage = computed(() => {
    const index = this.activeIndex();
    return index === null ? undefined : this.images()[index];
  });

  ngOnDestroy(): void {
    this.document.body.classList.remove('lightbox-open');
  }

  protected openLightbox(index: number, trigger: HTMLElement): void {
    this.triggerElement = trigger;
    this.closing = false;
    this.activeIndex.set(index);
    this.preloadAdjacent(index);
    this.document.body.classList.add('lightbox-open');
    const dialog = this.lightbox?.nativeElement;
    if (dialog && !dialog.open) dialog.showModal();
    this.document.defaultView?.setTimeout(() => this.closeButton?.nativeElement.focus(), 0);
  }

  protected closeLightbox(): void {
    if (this.closing || this.activeIndex() === null) return;
    this.closing = true;
    this.activeIndex.set(null);
    const view = this.document.defaultView;
    if (!view?.matchMedia || view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.completeClose();
    }
  }

  protected finishClose(event: AnimationCallbackEvent): void {
    const animations = event.target.getAnimations();
    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      this.completeClose();
      event.animationComplete();
    });
  }

  private completeClose(): void {
    const dialog = this.lightbox?.nativeElement;
    if (dialog?.open) dialog.close();
    this.closing = false;
    this.document.body.classList.remove('lightbox-open');
    queueMicrotask(() => this.triggerElement?.focus());
  }

  protected previous(): void {
    const current = this.activeIndex();
    if (current === null) return;
    void this.navigateTo((current - 1 + this.images().length) % this.images().length);
  }

  protected next(): void {
    const current = this.activeIndex();
    if (current === null) return;
    void this.navigateTo((current + 1) % this.images().length);
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeLightbox();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected handleCancel(event: Event): void {
    event.preventDefault();
    this.closeLightbox();
  }

  protected closeFromBackdrop(event: MouseEvent): void {
    if (event.target === this.lightbox?.nativeElement) this.closeLightbox();
  }

  protected startTouch(event: PointerEvent): void {
    if (event.pointerType !== 'touch') return;
    this.touchStartX = event.clientX;
    this.touchStartY = event.clientY;
  }

  protected endTouch(event: PointerEvent): void {
    if (
      event.pointerType !== 'touch' ||
      this.touchStartX === undefined ||
      this.touchStartY === undefined
    )
      return;
    const deltaX = event.clientX - this.touchStartX;
    const deltaY = event.clientY - this.touchStartY;
    this.touchStartX = undefined;
    this.touchStartY = undefined;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    deltaX < 0 ? this.next() : this.previous();
  }

  private trapFocus(event: KeyboardEvent): void {
    const dialog = this.lightbox?.nativeElement;
    if (!dialog) return;
    const focusable = [
      ...dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ].filter((element) => !element.hasAttribute('hidden'));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private async navigateTo(index: number): Promise<void> {
    const image = this.images()[index];
    if (image && this.decodedSources.has(image.webpSrc)) {
      this.activeIndex.set(index);
      this.preloadAdjacent(index);
      return;
    }

    const request = ++this.navigationRequest;
    await this.preload(image);
    if (request !== this.navigationRequest || this.activeIndex() === null) return;
    this.activeIndex.set(index);
    this.preloadAdjacent(index);
  }

  private preloadAdjacent(index: number): void {
    const length = this.images().length;
    void this.preload(this.images()[(index - 1 + length) % length]);
    void this.preload(this.images()[(index + 1) % length]);
  }

  private preload(image: GalleryImage | undefined): Promise<void> {
    const view = this.document.defaultView;
    if (!view || !image) return Promise.resolve();
    const preloadImage = new view.Image();
    preloadImage.src = image.webpSrc;
    if (!preloadImage.decode) {
      this.decodedSources.add(image.webpSrc);
      return Promise.resolve();
    }

    return preloadImage
      .decode()
      .catch(() => undefined)
      .then(() => this.decodedSources.add(image.webpSrc))
      .then(() => undefined);
  }
}
