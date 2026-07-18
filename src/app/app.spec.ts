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
});
