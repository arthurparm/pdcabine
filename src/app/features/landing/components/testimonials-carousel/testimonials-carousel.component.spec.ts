import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialsCarouselComponent } from './testimonials-carousel.component';

type MatchMediaState = { tablet?: boolean; desktop?: boolean; reducedMotion?: boolean };

describe('TestimonialsCarouselComponent', () => {
  let fixture: ComponentFixture<TestimonialsCarouselComponent>;
  let element: HTMLElement;

  function mockMatchMedia(state: MatchMediaState = {}): void {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string): MediaQueryList => ({
        matches: query.includes('prefers-reduced-motion')
          ? Boolean(state.reducedMotion)
          : query.includes('70rem')
            ? Boolean(state.desktop)
            : Boolean(state.tablet),
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

  async function createComponent(state: MatchMediaState = {}): Promise<void> {
    mockMatchMedia(state);
    fixture = TestBed.createComponent(TestimonialsCarouselComponent);
    fixture.componentRef.setInput('rating', '5,0');
    fixture.componentRef.setInput('reviewCount', 246);
    fixture.componentRef.setInput('recommendationRate', '100%');
    fixture.componentRef.setInput('sourceLabel', 'Casamentos.com.br');
    fixture.componentRef.setInput('sourceUrl', 'https://example.com/avaliacoes');
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
  }

  function controls(): {
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    autoplay: HTMLButtonElement;
  } {
    return {
      previous: element.querySelector<HTMLButtonElement>(
        '[aria-label="Mostrar avaliações anteriores"]',
      )!,
      next: element.querySelector<HTMLButtonElement>('[aria-label="Mostrar próximas avaliações"]')!,
      autoplay: element.querySelector<HTMLButtonElement>('.autoplay-button')!,
    };
  }

  function activeIndicator(): number {
    return [...element.querySelectorAll('.carousel-indicators button')].findIndex(
      (indicator) => indicator.getAttribute('aria-current') === 'true',
    );
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialsCarouselComponent],
    }).compileComponents();
  });

  afterEach(() => {
    fixture?.destroy();
    vi.restoreAllMocks();
  });

  it('avança e atualiza a região de status somente por ação manual', async () => {
    await createComponent();
    expect(element.querySelector('[role="status"]')?.textContent).toBe('');

    controls().next.click();
    fixture.detectChanges();

    expect(activeIndicator()).toBe(1);
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Avaliação 2 de 8');
  });

  it('volta para a página anterior', async () => {
    await createComponent();
    controls().next.click();
    fixture.detectChanges();
    controls().previous.click();
    fixture.detectChanges();

    expect(activeIndicator()).toBe(0);
    expect(controls().previous.disabled).toBe(true);
  });

  it('vai diretamente para um indicador clicado', async () => {
    await createComponent({ tablet: true });
    const indicators = element.querySelectorAll<HTMLButtonElement>('.carousel-indicators button');

    indicators[2].click();
    fixture.detectChanges();

    expect(activeIndicator()).toBe(2);
    expect(element.querySelector('[role="status"]')?.textContent).toContain(
      'Avaliações 5 a 6 de 8',
    );
  });

  it('pausa e retoma a rotação automática pelo controle visível', async () => {
    await createComponent();
    const autoplay = controls().autoplay;

    autoplay.click();
    fixture.detectChanges();
    expect(autoplay.getAttribute('aria-pressed')).toBe('true');
    expect(autoplay.textContent).toContain('Retomar');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('pausada');

    autoplay.click();
    fixture.detectChanges();
    expect(autoplay.getAttribute('aria-pressed')).toBe('false');
    expect(autoplay.textContent).toContain('Pausar');
    expect(element.querySelector('[role="status"]')?.textContent).toContain('retomada');
  });

  it('navega com as setas do teclado', async () => {
    await createComponent();

    element
      .querySelector('.reviews')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
      );
    fixture.detectChanges();
    expect(activeIndicator()).toBe(1);

    element
      .querySelector('.reviews')
      ?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }),
      );
    fixture.detectChanges();
    expect(activeIndicator()).toBe(0);
  });

  it('mantém o índice nos limites ao insistir em avançar ou voltar', async () => {
    await createComponent({ desktop: true, tablet: true });
    const { next, previous } = controls();

    for (let attempt = 0; attempt < 10; attempt += 1) next.click();
    fixture.detectChanges();
    expect(activeIndicator()).toBe(2);
    expect(next.disabled).toBe(true);
    expect(element.querySelectorAll('.review-card[aria-hidden="true"]')).toHaveLength(5);

    for (let attempt = 0; attempt < 10; attempt += 1) previous.click();
    fixture.detectChanges();
    expect(activeIndicator()).toBe(0);
    expect(previous.disabled).toBe(true);
  });

  it('não agenda autoplay quando movimento reduzido está ativo', async () => {
    mockMatchMedia({ reducedMotion: true });
    const intervalSpy = vi.spyOn(window, 'setInterval');
    fixture = TestBed.createComponent(TestimonialsCarouselComponent);
    fixture.componentRef.setInput('rating', '5,0');
    fixture.componentRef.setInput('reviewCount', 246);
    fixture.componentRef.setInput('recommendationRate', '100%');
    fixture.componentRef.setInput('sourceLabel', 'Casamentos.com.br');
    fixture.componentRef.setInput('sourceUrl', 'https://example.com/avaliacoes');
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;

    expect(intervalSpy.mock.calls.some((call) => call[1] === 6500)).toBe(false);
    expect(element.querySelector('.autoplay-button')).not.toBeNull();
  });

  it('expõe a semântica e a origem pública sem tratar os resumos como transcrições', async () => {
    await createComponent();
    const region = element.querySelector('.reviews');
    const sourceLink = element.querySelector<HTMLAnchorElement>('.reviews-link');

    expect(region?.getAttribute('role')).toBe('region');
    expect(region?.getAttribute('aria-roledescription')).toBe('carousel');
    expect(element.querySelectorAll('.review-card')).toHaveLength(8);
    expect(element.querySelectorAll('.review-source')[0]?.textContent).toContain(
      'Resumo de avaliação pública',
    );
    expect(sourceLink?.target).toBe('_blank');
    expect(sourceLink?.rel).toBe('noopener noreferrer');
    expect(sourceLink?.href).toBe('https://example.com/avaliacoes');
    expect(controls().next.getAttribute('aria-controls')).toBe('reviews-track');
    expect(controls().next.querySelector('svg')).not.toBeNull();
    expect(controls().autoplay.querySelector('svg')).not.toBeNull();
  });

  it('suspends autoplay during hover and focus, then resumes it', async () => {
    mockMatchMedia();
    const intervalSpy = vi.spyOn(window, 'setInterval').mockReturnValue(42);
    const clearSpy = vi.spyOn(window, 'clearInterval');
    fixture = TestBed.createComponent(TestimonialsCarouselComponent);
    fixture.componentRef.setInput('rating', '5,0');
    fixture.componentRef.setInput('reviewCount', 246);
    fixture.componentRef.setInput('recommendationRate', '100%');
    fixture.componentRef.setInput('sourceLabel', 'Casamentos.com.br');
    fixture.componentRef.setInput('sourceUrl', 'https://example.com/avaliacoes');
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement as HTMLElement;
    const region = element.querySelector('.reviews')!;

    expect(intervalSpy.mock.calls.some((call) => call[1] === 6500)).toBe(true);
    region.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(clearSpy).toHaveBeenCalledWith(42);

    region.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    await fixture.whenStable();
    const intervalsAfterHover = intervalSpy.mock.calls.length;
    region.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    region.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(intervalSpy.mock.calls.length).toBeGreaterThan(intervalsAfterHover);
  });
});
