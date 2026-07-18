import { DOCUMENT } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { createWhatsAppUrl } from '../../../../core/config/site.config';

interface BudgetFormValue {
  readonly name: string;
  readonly eventType: string;
  readonly eventDate: string;
  readonly message: string;
}

@Component({
  selector: 'app-contact-section',
  imports: [FormsModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  private readonly document = inject(DOCUMENT);

  readonly companyName = input.required<string>();
  readonly serviceRegion = input.required<string>();
  readonly whatsappUrl = input.required<string>();
  readonly whatsappNumber = input.required<string>();

  protected submitBudget(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    const value = form.value as BudgetFormValue;
    const date = value.eventDate || 'a definir';
    const details = value.message?.trim() || 'Quero conhecer as opções disponíveis.';
    const message =
      `Olá, PD Cabine! Meu nome é ${value.name}. ` +
      `Gostaria de um orçamento para ${value.eventType}, com data ${date}. ${details}`;
    this.document.defaultView?.open(createWhatsAppUrl(this.whatsappNumber(), message), '_blank', 'noopener,noreferrer');
  }
}
