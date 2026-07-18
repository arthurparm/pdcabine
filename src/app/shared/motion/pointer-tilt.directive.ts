import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  RendererStyleFlags2,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appPointerTilt]',
  host: {
    class: 'pointer-tilt',
    '(pointermove)': 'handlePointerMove($event)',
    '(pointerleave)': 'reset()',
    '(pointercancel)': 'reset()',
  },
})
export class PointerTiltDirective implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);
  private frameId?: number;
  private pointerX = 0;
  private pointerY = 0;

  readonly appPointerTilt = input(3, { transform: numberAttribute });

  handlePointerMove(event: PointerEvent): void {
    const view = this.document.defaultView;
    if (!this.motionIsAllowed(view) || !view) return;

    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    if (this.frameId !== undefined) return;

    this.frameId = view.requestAnimationFrame(() => {
      this.frameId = undefined;
      const bounds = this.element.nativeElement.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const intensity = Math.min(3, Math.max(0, this.appPointerTilt()));
      const x = (this.pointerX - bounds.left) / bounds.width - 0.5;
      const y = (this.pointerY - bounds.top) / bounds.height - 0.5;
      this.setMotionVariables(-y * intensity, x * intensity, x * 4, y * 4);
    });
  }

  reset(): void {
    const view = this.document.defaultView;
    if (this.frameId !== undefined && view) view.cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
    this.setMotionVariables(0, 0, 0, 0);
  }

  ngOnDestroy(): void {
    this.reset();
  }

  private motionIsAllowed(view: Window | null): boolean {
    return Boolean(
      view?.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !view.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
  }

  private setMotionVariables(
    rotateX: number,
    rotateY: number,
    shiftX: number,
    shiftY: number,
  ): void {
    const host = this.element.nativeElement;
    const flags = RendererStyleFlags2.DashCase;
    this.renderer.setStyle(host, '--pointer-rotate-x', `${rotateX.toFixed(2)}deg`, flags);
    this.renderer.setStyle(host, '--pointer-rotate-y', `${rotateY.toFixed(2)}deg`, flags);
    this.renderer.setStyle(host, '--pointer-shift-x', `${shiftX.toFixed(2)}px`, flags);
    this.renderer.setStyle(host, '--pointer-shift-y', `${shiftY.toFixed(2)}px`, flags);
  }
}
