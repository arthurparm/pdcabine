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
  let form: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSectionComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ContactSectionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('companyName', SITE_CONFIG.companyName);
    fixture.componentRef.setInput('whatsappNumber', SITE_CONFIG.whatsapp.normalized);
    fixture.componentRef.setInput('contactConfig', SITE_CONFIG.contact);
    fixture.detectChanges();
    form = (component as any).budgetForm;
  });

  it('starts empty, invalid and without premature error messages', () => {
    expect(form.invalid).toBe(true);
    expect(form.controls.serviceIds.value).toEqual([]);
    expect(fixture.nativeElement.querySelectorAll('[id$="-error"]')).toHaveLength(0);
    expect(fixture.nativeElement.querySelector('.success-message')).toBeNull();
  });

  it('shows required validation feedback only after the first submit attempt', () => {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#budget-name-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#budget-phone-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#services-error')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#consent-error')).not.toBeNull();
  });

  it('validates an optional e-mail only when it is filled', () => {
    expect(form.controls.email.valid).toBe(true);
    form.controls.email.setValue('email-invalido');
    expect(form.controls.email.hasError('email')).toBe(true);
    form.controls.email.setValue('contato@exemplo.com');
    expect(form.controls.email.valid).toBe(true);
  });

  it('requires explicit consent', () => {
    expect(form.controls.consent.hasError('required')).toBe(true);
    form.controls.consent.setValue(true);
    expect(form.controls.consent.valid).toBe(true);
  });

  it('requires and supports multiple service selections', () => {
    expect(form.controls.serviceIds.invalid).toBe(true);
    (component as any).toggleService('totem-fotografico', true);
    (component as any).toggleService('plataforma-360', true);
    expect(form.controls.serviceIds.value).toEqual(['totem-fotografico', 'plataforma-360']);
    expect(form.controls.serviceIds.valid).toBe(true);
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
    expect((component as any).processing()).toBe(true);
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
    expect(form.controls.name.value).toBe('Maria da Silva');
    vi.useRealTimers();
  });

  function fillValidForm(): void {
    form.setValue({
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
