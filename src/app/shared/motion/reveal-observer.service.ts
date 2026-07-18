import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RevealObserverService {
  private readonly document = inject(DOCUMENT);
  private readonly callbacks = new Map<Element, () => void>();
  private observer?: IntersectionObserver;

  observe(element: Element, reveal: () => void): () => void {
    const view = this.document.defaultView;
    const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;

    if (!view || typeof IntersectionObserver === 'undefined' || reducedMotion) {
      reveal();
      return () => undefined;
    }

    this.callbacks.set(element, reveal);
    this.getObserver().observe(element);

    return () => {
      this.observer?.unobserve(element);
      this.callbacks.delete(element);
    };
  }

  private getObserver(): IntersectionObserver {
    if (this.observer) return this.observer;

    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          this.callbacks.get(entry.target)?.();
          this.observer?.unobserve(entry.target);
          this.callbacks.delete(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    return this.observer;
  }
}
