import { Component, input, signal } from '@angular/core';
import type { NavigationItem } from '../../../../core/models/navigation-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  readonly companyName = input.required<string>();
  readonly logoPath = input.required<string>();
  readonly navigation = input.required<readonly NavigationItem[]>();
  readonly whatsappUrl = input.required<string>();

  protected readonly menuOpen = signal(false);

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
