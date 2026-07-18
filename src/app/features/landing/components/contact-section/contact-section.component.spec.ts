import { TestBed } from '@angular/core/testing';
import { SITE_CONFIG, createWhatsAppUrl } from '../../../../core/config/site.config';
import { ConversionTrackerService } from '../../../../core/services/conversion-tracker.service';
import {
  ContactSectionComponent,
  buildBudgetMessage,
  type BudgetFormData,
} from './contact-section.component';

describe('ContactSectionComponent', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<ContactSectionComponent>>;
  let component: ContactSectionComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('whatsappNumber', SITE_CONFIG.whatsapp.normalized);
    fixture.componentRef.setInput('contactConfig', SITE_CONFIG.contact);
    fixture.detectChanges();
  });

  it('starts empty, invalid and without premature error messages', () => {
    expect(component.budgetForm.invalid).toBe(true);
    expect(component.budgetForm.controls.serviceIds.value).toEqual([]);
    expect(fixture.nativeElement.querySelectorAll('[id$="-error"]')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.success-message')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('[required]')).toHaveLength(6);
  });

  it('shows required validation feedback only after the first submit attempt', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#budget-name-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#budget-phone-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#services-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#consent-error')).not.toBeNull();
  });

  it('moves focus to the first invalid field after an invalid submit', async () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));

    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#budget-name'));
  });

  it('validates an optional e-mail only when it is filled', () => {
    expect(component.budgetForm.controls.email.valid).toBe(true);
    component.budgetForm.controls.email.setValue('email-invalido');
    expect(component.budgetForm.controls.email.hasError('email')).toBe(true);
    component.budgetForm.controls.email.setValue('contato@exemplo.com');
    expect(component.budgetForm.controls.email.valid).toBe(true);
  });

  it('requires explicit consent', () => {
    expect(component.budgetForm.controls.consent.hasError('required')).toBe(true);
    component.budgetForm.controls.consent.setValue(true);
    expect(component.budgetForm.controls.consent.valid).toBe(true);
  });

  it('requires and supports multiple service selections', () => {
    expect(component.budgetForm.controls.serviceIds.invalid).toBe(true);
    const element = fixture.nativeElement as HTMLElement;
    const choices = element.querySelectorAll<HTMLInputElement>('.service-options input');
    choices[0].click();
    choices[5].click();
    expect(component.budgetForm.controls.serviceIds.value).toEqual([
      'totem-fotografico',
      'plataforma-360',
    ]);
    expect(component.budgetForm.controls.serviceIds.valid).toBe(true);
  });

  it('blocks invalid submissions before opening a browsing context', () => {
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('tracks a valid conversion and preserves data when the popup is blocked', async () => {
    vi.useFakeTimers();
    const openSpy = vi.spyOn(window, 'open').mockReturnValue(null);
    const tracker = TestBed.inject(ConversionTrackerService);
    const trackSpy = vi.spyOn(tracker, 'track');
    fillValidForm();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    const submitButton = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>(
      '.submit-button',
    );
    expect(submitButton?.disabled).toBe(true);
    expect(openSpy).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(300);
    fixture.detectChanges();
    expect(trackSpy).toHaveBeenCalledWith({ name: 'budget_request_prepared', channel: 'whatsapp' });
    expect(fixture.nativeElement.querySelector('.success-message').textContent).toContain(
      'Sua solicitação foi preparada',
    );
    expect(fixture.nativeElement.querySelector('.fallback-button').href).toContain(
      'https://wa.me/5511999892708?text=',
    );
    expect(component.budgetForm.controls.name.value).toBe('Maria da Silva');
    vi.useRealTimers();
  });

  function fillValidForm(): void {
    component.budgetForm.setValue({
      name: 'Maria da Silva',
      phone: '(11) 99989-2708',
      email: '',
      eventDate: '2026-11-22',
      eventType: 'Casamento',
      region: 'São Paulo',
      guestCount: 150,
      serviceIds: ['totem-fotografico', 'plataforma-360'],
      message: '',
      consent: true,
    });
  }
});

describe('budget WhatsApp message', () => {
  const value: BudgetFormData = {
    name: '  Maria da Silva  ',
    phone: '11999892708',
    email: '',
    eventDate: '2026-11-22',
    eventType: 'Casamento',
    region: ' São Paulo ',
    guestCount: null,
    serviceIds: ['totem-fotografico', 'plataforma-360'],
    message: '',
    consent: true,
  };

  it('builds the specified organized message with explicit optional fallbacks', () => {
    const message = buildBudgetMessage(value, SITE_CONFIG.contact.serviceOptions);
    expect(message).toBe(`Olá, PD Cabine! Gostaria de solicitar um orçamento.

Nome: Maria da Silva
WhatsApp: (11) 99989-2708
E-mail: não informado
Data do evento: 22/11/2026
Tipo de evento: Casamento
Cidade ou região: São Paulo
Convidados: não informado
Serviços de interesse: Totem fotográfico, Plataforma 360°
Mensagem: não informada

Envio realizado pelo site da PD Cabine.`);
  });

  it('encodes every message line in the generated official WhatsApp URL', () => {
    const message = buildBudgetMessage(value, SITE_CONFIG.contact.serviceOptions);
    const url = createWhatsAppUrl(SITE_CONFIG.whatsapp.normalized, message);
    expect(url).toBe(`https://wa.me/5511999892708?text=${encodeURIComponent(message)}`);
    expect(decodeURIComponent(url.split('?text=')[1])).toBe(message);
  });
});
