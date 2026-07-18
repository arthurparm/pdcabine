import { Component, input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-floating-button',
  templateUrl: './whatsapp-floating-button.component.html',
  styleUrl: './whatsapp-floating-button.component.scss'
})
export class WhatsappFloatingButtonComponent {
  readonly url = input.required<string>();
  readonly companyName = input.required<string>();
}
