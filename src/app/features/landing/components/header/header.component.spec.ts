import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  const callbacks: IntersectionObserverCallback[] = [];

  beforeEach(async () => {
    callbacks.length = 0;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        readonly root = null;
        readonly rootMargin = '';
        readonly thresholds = [0];
        constructor(callback: IntersectionObserverCallback) {
          callbacks.push(callback);
        }
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
        takeRecords = vi.fn(() => []);
      },
    );
    await TestBed.configureTestingModule({ imports: [HeaderComponent] }).compileComponents();
  });

  afterEach(() => {
    document.getElementById('header-scroll-sentinel')?.remove();
    vi.unstubAllGlobals();
  });

  it('derives the scrolled surface from the observed sentinel', () => {
    const sentinel = document.createElement('span');
    sentinel.id = 'header-scroll-sentinel';
    document.body.append(sentinel);
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('companyName', 'PD Cabine');
    fixture.componentRef.setInput('logoPath', '/logo.png');
    fixture.componentRef.setInput('logoSrcSet', '/logo.webp 192w');
    fixture.componentRef.setInput('navigation', []);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.site-header') as HTMLElement;

    callbacks[0](
      [{ isIntersecting: true, target: sentinel } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    fixture.detectChanges();
    expect(header.classList).not.toContain('site-header--scrolled');

    callbacks[0](
      [{ isIntersecting: false, target: sentinel } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    fixture.detectChanges();
    expect(header.classList).toContain('site-header--scrolled');
  });
});
