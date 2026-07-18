import { Component, input } from '@angular/core';
import type { SiteConfig } from '../../../../core/config/site.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly config = input.required<SiteConfig>();
  protected readonly currentYear = new Date().getFullYear();
}
