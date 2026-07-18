import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PointerTiltDirective } from './pointer-tilt.directive';
import { RevealDirective } from './reveal.directive';

@Component({
  imports: [PointerTiltDirective, RevealDirective],
  template: `
    <div class="reveal-target" appReveal="up">Conteúdo</div>
    <div class="tilt-target" [appPointerTilt]="3">Card</div>
  `,
})
class MotionHostComponent {}

describe('motion directives', () => {
  let fixture: ComponentFixture<MotionHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MotionHostComponent] }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('keeps reveal content visible when IntersectionObserver is unavailable', () => {
    fixture = TestBed.createComponent(MotionHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.reveal-target').classList).toContain(
      'is-revealed',
    );
  });

  it('coalesces pointer updates into one animation frame and caps tilt', () => {
    mockMatchMedia(false);
    const frameSpy = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    fixture = TestBed.createComponent(MotionHostComponent);
    fixture.detectChanges();
    frameSpy.mockClear();
    const target = fixture.nativeElement.querySelector('.tilt-target') as HTMLElement;
    const directive = fixture.debugElement
      .query(By.css('.tilt-target'))
      .injector.get(PointerTiltDirective);
    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      toJSON: () => ({}),
    });

    (directive as any).handlePointerMove(
      new PointerEvent('pointermove', { clientX: 100, clientY: 0 }),
    );
    (directive as any).handlePointerMove(
      new PointerEvent('pointermove', { clientX: 90, clientY: 10 }),
    );
    expect(frameSpy).toHaveBeenCalledOnce();

    frameSpy.mock.calls[0][0](16);
    expect(target.style.getPropertyValue('--pointer-rotate-x')).toBe('1.20deg');
    expect(target.style.getPropertyValue('--pointer-rotate-y')).toBe('1.20deg');
  });

  it('does not schedule tilt when reduced motion is active', () => {
    mockMatchMedia(true);
    const frameSpy = vi.spyOn(window, 'requestAnimationFrame');
    fixture = TestBed.createComponent(MotionHostComponent);
    fixture.detectChanges();
    frameSpy.mockClear();

    const directive = fixture.debugElement
      .query(By.css('.tilt-target'))
      .injector.get(PointerTiltDirective);
    (directive as any).handlePointerMove(
      new PointerEvent('pointermove', { clientX: 80, clientY: 20 }),
    );

    expect(frameSpy).not.toHaveBeenCalled();
  });

  function mockMatchMedia(reducedMotion: boolean): void {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('prefers-reduced-motion') ? reducedMotion : true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      })),
    });
  }
});
