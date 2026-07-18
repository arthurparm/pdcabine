import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  inject,
  input,
  signal
} from '@angular/core';
import type { NavigationItem } from '../../../../core/models/navigation-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private sectionObserver?: IntersectionObserver;

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  readonly companyName = input.required<string>();
  readonly logoPath = input.required<string>();
  readonly navigation = input.required<readonly NavigationItem[]>();
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeSection = signal('inicio');

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.activeSection.set(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] }
    );

    for (const item of this.navigation()) {
      const section = this.document.getElementById(item.id);
      if (section) this.sectionObserver.observe(section);
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.document.body.classList.remove('menu-open');
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.scrolled.set((this.document.defaultView?.scrollY ?? 0) > 24);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menuOpen()) this.closeMenu(true);
  }

  protected toggleMenu(): void {
    const nextState = !this.menuOpen();
    this.menuOpen.set(nextState);
    this.document.body.classList.toggle('menu-open', nextState);
  }

  protected closeMenu(restoreFocus = false): void {
    this.menuOpen.set(false);
    this.document.body.classList.remove('menu-open');
    if (restoreFocus) this.menuButton?.nativeElement.focus();
  }
}
