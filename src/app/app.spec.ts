import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  it('composes every section of the landing page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('app-header')).not.toBeNull();
    expect(page.querySelector('app-hero')).not.toBeNull();
    expect(page.querySelector('app-services')).not.toBeNull();
    expect(page.querySelector('app-experience-gallery')).not.toBeNull();
    expect(page.querySelector('app-social-proof')).not.toBeNull();
    expect(page.querySelector('app-testimonials-carousel')).not.toBeNull();
    expect(page.querySelector('app-contact-section')).not.toBeNull();
    expect(page.querySelector('app-footer')).not.toBeNull();
    expect(page.querySelector('app-whatsapp-floating-button')).not.toBeNull();
  });

  it('renders accessible navigation, heading order and supplied public proof', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const menuButton = page.querySelector<HTMLButtonElement>('[aria-controls="primary-navigation"]');
    const headings = [...page.querySelectorAll('h1, h2')].map((heading) => heading.tagName);

    expect(page.querySelector('.skip-link')?.getAttribute('href')).toBe('#conteudo-principal');
    expect(page.querySelector('nav')?.getAttribute('aria-label')).toBe('Navegação principal');
    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(headings[0]).toBe('H1');
    expect(page.querySelector('#avaliacoes')?.textContent).toContain('246 avaliações públicas');
    expect(page.querySelector('app-social-proof')?.textContent).toContain('2022–2026');
    expect(page.querySelector('.whatsapp-button')?.getAttribute('aria-label')).toContain('WhatsApp');
  });

  it('opens and closes the responsive navigation state', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const menuButton = page.querySelector<HTMLButtonElement>('[aria-controls="primary-navigation"]');

    menuButton?.click();
    fixture.detectChanges();

    expect(menuButton?.getAttribute('aria-expanded')).toBe('true');
    expect(page.querySelector('#primary-navigation')?.classList).toContain('navigation--open');
    expect(document.body.classList).toContain('menu-open');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(menuButton?.getAttribute('aria-expanded')).toBe('false');
    expect(document.body.classList).not.toContain('menu-open');
    expect(document.activeElement).toBe(menuButton);
  });

  it('selects a service from its card in the budget form', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const firstCta = page.querySelector<HTMLAnchorElement>('.service-card a');

    firstCta?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const firstService = page.querySelector<HTMLInputElement>('.service-options input');
    expect(firstService?.checked).toBe(true);
  });

  it('includes the selected service in the WhatsApp budget message', async () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;

    page.querySelector<HTMLAnchorElement>('.service-card a')?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const name = page.querySelector<HTMLInputElement>('#budget-name')!;
    const phone = page.querySelector<HTMLInputElement>('#budget-phone')!;
    const eventDate = page.querySelector<HTMLInputElement>('#event-date')!;
    const eventType = page.querySelector<HTMLSelectElement>('#event-type')!;
    const region = page.querySelector<HTMLInputElement>('#budget-region')!;
    const consent = page.querySelector<HTMLInputElement>('input[formcontrolname="consent"]')!;
    name.value = 'Cliente Teste';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    phone.value = '11999892708';
    phone.dispatchEvent(new Event('input', { bubbles: true }));
    eventDate.value = '2026-12-10';
    eventDate.dispatchEvent(new Event('input', { bubbles: true }));
    eventType.value = 'Casamento';
    eventType.dispatchEvent(new Event('change', { bubbles: true }));
    region.value = 'São Paulo';
    region.dispatchEvent(new Event('input', { bubbles: true }));
    consent.click();
    fixture.detectChanges();
    await fixture.whenStable();

    page.querySelector<HTMLFormElement>('form')?.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve, 350));
    fixture.detectChanges();

    const fallbackUrl = page.querySelector<HTMLAnchorElement>('.fallback-button')?.href ?? '';
    expect(decodeURIComponent(fallbackUrl)).toContain('Serviços de interesse: Totem fotográfico');
    open.mockRestore();
  });

  it('opens, cycles and closes the lightbox while restoring focus', async () => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value(this: HTMLDialogElement) { this.setAttribute('open', ''); }
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value(this: HTMLDialogElement) { this.removeAttribute('open'); }
    });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const page = fixture.nativeElement as HTMLElement;
    const trigger = page.querySelector<HTMLButtonElement>('.gallery-trigger');

    trigger?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const dialog = page.querySelector<HTMLDialogElement>('.lightbox');
    expect(dialog?.hasAttribute('open')).toBe(true);
    expect(document.body.classList).toContain('lightbox-open');
    expect(dialog?.textContent).toContain('1 de 10');

    dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(dialog?.textContent).toContain('10 de 10');

    dialog?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dialog?.hasAttribute('open')).toBe(false);
    expect(document.body.classList).not.toContain('lightbox-open');
    expect(document.activeElement).toBe(trigger);

    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).showModal;
    delete (HTMLDialogElement.prototype as Partial<HTMLDialogElement>).close;
  });
});
