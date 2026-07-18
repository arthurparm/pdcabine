import { Component, input } from '@angular/core';
import type { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  readonly services = input.required<readonly Service[]>();
}
