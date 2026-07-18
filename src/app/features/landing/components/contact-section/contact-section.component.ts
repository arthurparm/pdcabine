import { Component, input } from '@angular/core';

@Component({
  selector: 'app-contact-section',
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  readonly companyName = input.required<string>();
  readonly serviceRegion = input.required<string>();
  readonly whatsappUrl = input.required<string>();
}
