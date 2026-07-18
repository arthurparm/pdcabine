import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, OnDestroy, effect, inject, input, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
  type ValidationErrors,
  type ValidatorFn,
} from '@angular/forms';
import { createWhatsAppUrl, type SiteConfig } from '../../../../core/config/site.config';
import type { ServiceId } from '../../../../core/models/service.model';
import { ConversionTrackerService } from '../../../../core/services/conversion-tracker.service';
import { RevealDirective } from '../../../../shared/motion/reveal.directive';

export interface BudgetFormData {
  readonly name: string;
  readonly phone: string;
  readonly email: string;
  readonly eventDate: string;
  readonly eventType: string;
  readonly region: string;
  readonly guestCount: number | null;
  readonly serviceIds: readonly string[];
  readonly message: string;
  readonly consent: boolean;
}

const trimmedMinLength =
  (minimum: number): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null =>
    String(control.value ?? '').trim().length >= minimum ? null : { trimmedMinLength: true };

const validPhone: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const digits = normalizePhone(control.value);
  return digits.length === 10 || digits.length === 11 ? null : { phone: true };
};

const atLeastOne: ValidatorFn = (control: AbstractControl): ValidationErrors | null =>
  Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };

export function normalizePhone(value: unknown): string {
  return String(value ?? '')
    .replace(/\D/g, '')
    .replace(/^55(?=\d{10,11}$)/, '')
    .slice(0, 11);
}

export function formatPhone(value: unknown): string {
  const digits = normalizePhone(value);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatEventDate(value: string): string {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function buildBudgetMessage(
  value: BudgetFormData,
  serviceOptions: SiteConfig['contact']['serviceOptions'],
): string {
  const labels = value.serviceIds.map(
    (id) => serviceOptions.find((service) => service.id === id)?.label ?? id,
  );
  const email = value.email.trim() || 'não informado';
  const guests = value.guestCount ? String(value.guestCount) : 'não informado';
  const additionalMessage = value.message.trim() || 'não informada';

  return `Olá, PD Cabine! Gostaria de solicitar um orçamento.

Nome: ${value.name.trim()}
WhatsApp: ${formatPhone(value.phone)}
E-mail: ${email}
Data do evento: ${formatEventDate(value.eventDate)}
Tipo de evento: ${value.eventType}
Cidade ou região: ${value.region.trim()}
Convidados: ${guests}
Serviços de interesse: ${labels.join(', ')}
Mensagem: ${additionalMessage}

Envio realizado pelo site da PD Cabine.`;
}

@Component({
  selector: 'app-contact-section',
  imports: [ReactiveFormsModule, RevealDirective],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss',
})
export class ContactSectionComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly conversionTracker = inject(ConversionTrackerService);
  private processingTimer: ReturnType<typeof setTimeout> | undefined;
  private pendingPopup: WindowProxy | null = null;

  readonly whatsappNumber = input.required<string>();
  readonly contactConfig = input.required<SiteConfig['contact']>();
  readonly selectedService = input<{
    readonly id: ServiceId;
    readonly requestId: number;
  } | null>(null);

  protected readonly submitted = signal(false);
  protected readonly processing = signal(false);
  protected readonly success = signal(false);
  protected readonly fallbackUrl = signal<string | null>(null);

  readonly budgetForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, trimmedMinLength(3)]],
    phone: ['', [Validators.required, validPhone]],
    email: ['', Validators.email],
    eventDate: ['', Validators.required],
    eventType: ['', Validators.required],
    region: ['', [Validators.required, trimmedMinLength(2)]],
    guestCount: this.formBuilder.control<number | null>(null, Validators.min(1)),
    serviceIds: this.formBuilder.nonNullable.control<readonly string[]>([], atLeastOne),
    message: [''],
    consent: [false, Validators.requiredTrue],
  });

  constructor() {
    effect(() => {
      this.budgetForm.controls.message.setValidators(
        Validators.maxLength(this.contactConfig().messageMaxLength),
      );
      this.budgetForm.controls.message.updateValueAndValidity({ emitEvent: false });
      const selection = this.selectedService();
      if (!selection) return;
      const mappedIds = this.contactConfig().serviceSelectionMap[selection.id];
      this.budgetForm.controls.serviceIds.setValue(mappedIds);
      this.budgetForm.controls.serviceIds.markAsTouched();
    });
  }

  ngOnDestroy(): void {
    if (this.processingTimer) clearTimeout(this.processingTimer);
    this.pendingPopup?.close();
  }

  protected showError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || this.submitted());
  }

  protected onPhoneInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const normalized = normalizePhone(inputElement.value);
    const formatted = formatPhone(normalized);
    this.budgetForm.controls.phone.setValue(formatted, { emitEvent: false });
    inputElement.value = formatted;
  }

  protected trimField(field: 'name' | 'email' | 'region' | 'message'): void {
    const control = this.budgetForm.controls[field];
    const value = control.value
      .trim()
      .replace(field === 'email' ? /\s+/g : /\s{2,}/g, field === 'email' ? '' : ' ');
    control.setValue(value);
  }

  protected toggleService(serviceId: string, checked: boolean): void {
    const current = this.budgetForm.controls.serviceIds.value;
    const next = checked
      ? [...new Set([...current, serviceId])]
      : current.filter((id) => id !== serviceId);
    this.budgetForm.controls.serviceIds.setValue(next);
    this.budgetForm.controls.serviceIds.markAsTouched();
  }

  protected onServiceToggle(serviceId: string, event: Event): void {
    this.toggleService(serviceId, (event.currentTarget as HTMLInputElement).checked);
  }

  protected isServiceSelected(serviceId: string): boolean {
    return this.budgetForm.controls.serviceIds.value.includes(serviceId);
  }

  protected submitBudget(): void {
    this.submitted.set(true);
    this.success.set(false);
    this.fallbackUrl.set(null);
    this.trimField('name');
    this.trimField('email');
    this.trimField('region');
    this.trimField('message');

    if (this.budgetForm.invalid) {
      this.budgetForm.markAllAsTouched();
      this.document.defaultView?.setTimeout(() => {
        this.host.nativeElement
          .querySelector<HTMLElement>('[aria-invalid="true"]')
          ?.focus({ preventScroll: false });
      });
      return;
    }

    const message = buildBudgetMessage(
      this.budgetForm.getRawValue(),
      this.contactConfig().serviceOptions,
    );
    const url = createWhatsAppUrl(this.whatsappNumber(), message);
    this.processing.set(true);

    // Reserve a browsing context during the user gesture so stricter popup blockers can be detected.
    this.pendingPopup = this.document.defaultView?.open('', '_blank') ?? null;
    if (this.pendingPopup) this.pendingPopup.opener = null;

    this.processingTimer = setTimeout(() => {
      this.conversionTracker.track({ name: 'budget_request_prepared', channel: 'whatsapp' });
      this.processing.set(false);
      this.success.set(true);

      if (!this.pendingPopup) {
        this.fallbackUrl.set(url);
        return;
      }

      try {
        this.pendingPopup.location.replace(url);
      } catch {
        this.pendingPopup.close();
        this.fallbackUrl.set(url);
      } finally {
        this.pendingPopup = null;
      }
    }, 300);
  }
}
