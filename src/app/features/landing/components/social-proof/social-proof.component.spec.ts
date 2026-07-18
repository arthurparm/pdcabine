import { TestBed } from '@angular/core/testing';
import { SITE_CONFIG } from '../../../../core/config/site.config';
import { SocialProofComponent } from './social-proof.component';

describe('SocialProofComponent', () => {
  afterEach(() => vi.restoreAllMocks());

  it('animates canonical metrics once and settles on their exact values', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      })),
    });
    const frames: FrameRequestCallback[] = [];
    vi.spyOn(window.performance, 'now').mockReturnValue(100);
    const frameSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback) => frames.push(callback));
    await TestBed.configureTestingModule({ imports: [SocialProofComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SocialProofComponent);
    fixture.componentRef.setInput('metrics', SITE_CONFIG.socialProof.metrics);
    fixture.componentRef.setInput('verificationDate', 'julho de 2026');
    fixture.detectChanges();

    expect(frameSpy).toHaveBeenCalled();
    const scheduledFrames = frames.length;
    frames[scheduledFrames - 1](800);
    fixture.detectChanges();

    const visualValues = [
      ...fixture.nativeElement.querySelectorAll('.metrics dd [aria-hidden="true"]'),
    ].map((element: Element) => element.textContent?.trim());
    expect(visualValues).toEqual(SITE_CONFIG.socialProof.metrics.map((metric) => metric.value));
    fixture.destroy();
  });

  it('renders canonical values in the accessibility tree with reduced motion', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        matches: query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(() => true),
      })),
    });
    const frameSpy = vi.spyOn(window, 'requestAnimationFrame');
    await TestBed.configureTestingModule({ imports: [SocialProofComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SocialProofComponent);
    fixture.componentRef.setInput('metrics', SITE_CONFIG.socialProof.metrics);
    fixture.componentRef.setInput('verificationDate', 'julho de 2026');
    fixture.detectChanges();
    frameSpy.mockClear();

    const canonicalValues = [...fixture.nativeElement.querySelectorAll('.metrics dd .sr-only')].map(
      (element: Element) => element.textContent?.trim(),
    );
    const visualValues = [
      ...fixture.nativeElement.querySelectorAll('.metrics dd [aria-hidden="true"]'),
    ].map((element: Element) => element.textContent?.trim());
    expect(canonicalValues).toEqual(['5,0', '246', '+350', '2022–2026', '100%']);
    expect(visualValues).toEqual(canonicalValues);
    expect(frameSpy).not.toHaveBeenCalled();
  });
});
