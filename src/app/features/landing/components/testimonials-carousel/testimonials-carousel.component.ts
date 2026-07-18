import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { PUBLIC_REVIEWS } from '../../data/public-reviews';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';

const AUTOPLAY_INTERVAL_MS = 6500;
const SWIPE_THRESHOLD_PX = 48;

@Component({
  selector: 'app-testimonials-carousel',
  imports: [RevealDirective],
  templateUrl: './testimonials-carousel.component.html',
  styleUrl: './testimonials-carousel.component.scss',
})
export class TestimonialsCarouselComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly mediaQueryCleanups: Array<() => void> = [];
  private pointerStart?: { x: number; y: number; id: number };

  readonly rating = input.required<string>();
  readonly reviewCount = input.required<number>();
  readonly recommendationRate = input.required<string>();
  readonly sourceLabel = input.required<string>();
  readonly sourceUrl = input.required<string>();

  protected readonly reviews = PUBLIC_REVIEWS;
  protected readonly activeIndex = signal(0);
  protected readonly visibleCount = signal(1);
  protected readonly isUserPaused = signal(false);
  protected readonly isHovered = signal(false);
  protected readonly hasFocusWithin = signal(false);
  protected readonly isDocumentHidden = signal(this.document.hidden);
  protected readonly prefersReducedMotion = signal(
    this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
  );
  protected readonly statusMessage = signal('');
  protected readonly maxIndex = computed(() =>
    Math.max(0, this.reviews.length - this.visibleCount()),
  );
  protected readonly pageStarts = computed(() => {
    const count = this.visibleCount();
    const pageCount = Math.ceil(this.reviews.length / count);
    return Array.from({ length: pageCount }, (_, page) =>
      Math.min(page * count, this.maxIndex()),
    ).filter((start, page, starts) => page === 0 || start !== starts[page - 1]);
  });
  protected readonly currentPage = computed(() =>
    Math.max(0, this.pageStarts().indexOf(this.activeIndex())),
  );
  protected readonly trackTransform = computed(() => {
    const count = this.visibleCount();
    return `translateX(calc(-${this.activeIndex()} * ((100% - (var(--carousel-gap) * ${count - 1})) / ${count} + var(--carousel-gap))))`;
  });
  private readonly canAutoplay = computed(
    () =>
      !this.isUserPaused() &&
      !this.isHovered() &&
      !this.hasFocusWithin() &&
      !this.isDocumentHidden() &&
      !this.prefersReducedMotion(),
  );
  private readonly autoplayEffect = effect((onCleanup) => {
    const view = this.document.defaultView;
    if (!view || !this.canAutoplay() || this.pageStarts().length < 2) return;
    const intervalId = view.setInterval(() => this.advanceAutomatically(), AUTOPLAY_INTERVAL_MS);
    onCleanup(() => view.clearInterval(intervalId));
  });

  ngAfterViewInit(): void {
    const view = this.document.defaultView;
    if (!view?.matchMedia) return;

    const tabletQuery = view.matchMedia('(min-width: 48rem)');
    const desktopQuery = view.matchMedia('(min-width: 70rem)');
    const reducedMotionQuery = view.matchMedia('(prefers-reduced-motion: reduce)');
    const updateLayout = (): void => {
      this.visibleCount.set(desktopQuery.matches ? 3 : tabletQuery.matches ? 2 : 1);
      this.activeIndex.update((index) => Math.min(index, this.maxIndex()));
    };
    const updateMotionPreference = (): void =>
      this.prefersReducedMotion.set(reducedMotionQuery.matches);

    this.observeMediaQuery(tabletQuery, updateLayout);
    this.observeMediaQuery(desktopQuery, updateLayout);
    this.observeMediaQuery(reducedMotionQuery, updateMotionPreference);
    updateLayout();
    updateMotionPreference();
    this.document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  ngOnDestroy(): void {
    this.autoplayEffect.destroy();
    this.mediaQueryCleanups.forEach((cleanup) => cleanup());
    this.document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  protected previous(): void {
    const page = Math.max(0, this.currentPage() - 1);
    this.setManualIndex(this.pageStarts()[page] ?? 0);
  }

  protected next(): void {
    const page = Math.min(this.pageStarts().length - 1, this.currentPage() + 1);
    this.setManualIndex(this.pageStarts()[page] ?? this.maxIndex());
  }

  protected goToPage(page: number): void {
    const safePage = Math.min(Math.max(page, 0), this.pageStarts().length - 1);
    this.setManualIndex(this.pageStarts()[safePage] ?? 0);
  }

  protected toggleAutoplay(): void {
    this.isUserPaused.update((paused) => !paused);
    this.statusMessage.set(
      this.isUserPaused() ? 'Rotação automática pausada.' : 'Rotação automática retomada.',
    );
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previous();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    }
  }

  protected handlePointerDown(event: PointerEvent): void {
    if (!event.isPrimary || event.button !== 0) return;
    this.pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  protected handlePointerUp(event: PointerEvent): void {
    const start = this.pointerStart;
    this.pointerStart = undefined;
    if (!start || start.id !== event.pointerId) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    deltaX < 0 ? this.next() : this.previous();
  }

  protected cancelPointer(): void {
    this.pointerStart = undefined;
  }

  protected isVisible(reviewIndex: number): boolean {
    return (
      reviewIndex >= this.activeIndex() && reviewIndex < this.activeIndex() + this.visibleCount()
    );
  }

  protected isHighlighted(reviewIndex: number): boolean {
    const highlightOffset = this.visibleCount() === 3 ? 1 : 0;
    return reviewIndex === this.activeIndex() + highlightOffset;
  }

  protected indicatorLabel(page: number): string {
    const first = (this.pageStarts()[page] ?? 0) + 1;
    const last = Math.min(first + this.visibleCount() - 1, this.reviews.length);
    return first === last
      ? `Ir para a avaliação ${first}`
      : `Ir para as avaliações ${first} a ${last}`;
  }

  private setManualIndex(index: number): void {
    this.activeIndex.set(Math.min(Math.max(index, 0), this.maxIndex()));
    const first = this.activeIndex() + 1;
    const last = Math.min(this.activeIndex() + this.visibleCount(), this.reviews.length);
    this.statusMessage.set(
      first === last
        ? `Avaliação ${first} de ${this.reviews.length}.`
        : `Avaliações ${first} a ${last} de ${this.reviews.length}.`,
    );
  }

  private advanceAutomatically(): void {
    const pages = this.pageStarts();
    const nextPage = (this.currentPage() + 1) % pages.length;
    this.activeIndex.set(pages[nextPage] ?? 0);
  }

  private readonly handleVisibilityChange = (): void => {
    this.isDocumentHidden.set(this.document.hidden);
  };

  private observeMediaQuery(query: MediaQueryList, listener: () => void): void {
    query.addEventListener('change', listener);
    this.mediaQueryCleanups.push(() => query.removeEventListener('change', listener));
  }
}
