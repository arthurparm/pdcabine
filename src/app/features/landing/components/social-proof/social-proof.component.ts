import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  input,
  signal,
} from '@angular/core';
import type { SocialProofMetric } from '../../../../core/config/site.config';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';
import { RevealObserverService } from '../../../../shared/motion/reveal-observer.service';

@Component({
  selector: 'app-social-proof',
  imports: [RevealDirective],
  templateUrl: './social-proof.component.html',
  styleUrl: './social-proof.component.scss',
})
export class SocialProofComponent implements AfterViewInit, OnDestroy {
  private readonly observer = inject(RevealObserverService);
  private stopObserving?: () => void;
  private frameId?: number;

  @ViewChild('proofPanel', { read: ElementRef }) private proofPanel?: ElementRef<HTMLElement>;

  readonly metrics = input.required<readonly SocialProofMetric[]>();
  readonly verificationDate = input.required<string>();
  protected readonly displayedValues = signal<readonly string[]>([]);

  protected displayedValue(index: number, metric: SocialProofMetric): string {
    return this.displayedValues()[index] ?? metric.value;
  }

  ngAfterViewInit(): void {
    this.displayedValues.set(
      this.metrics().map((metric) =>
        metric.animatedValue ? this.formatValue(metric, 0) : metric.value,
      ),
    );

    const panel = this.proofPanel?.nativeElement;
    if (panel) this.stopObserving = this.observer.observe(panel, () => this.startCounters());
  }

  ngOnDestroy(): void {
    this.stopObserving?.();
    const view = this.proofPanel?.nativeElement.ownerDocument.defaultView;
    if (this.frameId !== undefined && view) view.cancelAnimationFrame(this.frameId);
  }

  private startCounters(): void {
    const view = this.proofPanel?.nativeElement.ownerDocument.defaultView;
    if (!view?.matchMedia || view.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.displayedValues.set(this.metrics().map((metric) => metric.value));
      return;
    }

    const startedAt = view.performance.now();
    const duration = 700;
    const tick = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayedValues.set(
        this.metrics().map((metric) =>
          metric.animatedValue ? this.formatValue(metric, eased) : metric.value,
        ),
      );

      if (progress < 1) {
        this.frameId = view.requestAnimationFrame(tick);
      } else {
        this.frameId = undefined;
        this.displayedValues.set(this.metrics().map((metric) => metric.value));
      }
    };

    this.frameId = view.requestAnimationFrame(tick);
  }

  private formatValue(metric: SocialProofMetric, progress: number): string {
    const animation = metric.animatedValue;
    if (!animation) return metric.value;
    const value = animation.target * progress;
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: animation.decimals,
      maximumFractionDigits: animation.decimals,
    }).format(value);
    return `${animation.prefix ?? ''}${formatted}${animation.suffix ?? ''}`;
  }
}
