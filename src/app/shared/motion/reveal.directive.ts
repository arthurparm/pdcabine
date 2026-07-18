import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { RevealObserverService } from './reveal-observer.service';

export type RevealVariant = 'fade' | 'up' | 'scale';

@Directive({
  selector: '[appReveal]',
  host: {
    class: 'motion-reveal',
    '[class.motion-reveal--fade]': 'appReveal() === "fade"',
    '[class.motion-reveal--up]': 'appReveal() === "up"',
    '[class.motion-reveal--scale]': 'appReveal() === "scale"',
    '[class.is-revealed]': 'revealed()',
    '[style.--reveal-delay]': 'delayCss()',
  },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly observer = inject(RevealObserverService);
  private stopObserving?: () => void;

  readonly appReveal = input<RevealVariant>('up');
  readonly revealDelay = input(0, { transform: numberAttribute });
  protected readonly revealed = signal(false);
  protected readonly delayCss = () => `${Math.max(0, this.revealDelay())}ms`;

  ngAfterViewInit(): void {
    this.stopObserving = this.observer.observe(this.element.nativeElement, () => {
      this.revealed.set(true);
    });
  }

  ngOnDestroy(): void {
    this.stopObserving?.();
  }
}
