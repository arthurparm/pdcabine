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
  signal,
} from '@angular/core';
import type { NavigationItem } from '../../../../core/models/navigation-item.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private sectionObserver?: IntersectionObserver;
  private scrollStateObserver?: IntersectionObserver;

  @ViewChild('menuButton') private menuButton?: ElementRef<HTMLButtonElement>;

  readonly companyName = input.required<string>();
  readonly logoPath = input.required<string>();
  readonly logoSrcSet = input.required<string>();
  readonly navigation = input.required<readonly NavigationItem[]>();
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly activeSection = signal('inicio');

  ngAfterViewInit(): void {
    this.onHashChange();
    if (typeof IntersectionObserver === 'undefined') return;

    const scrollSentinel = this.document.getElementById('header-scroll-sentinel');
    if (scrollSentinel) {
      this.scrollStateObserver = new IntersectionObserver(
        ([entry]) => this.scrolled.set(!entry.isIntersecting),
        { rootMargin: '-24px 0px 0px 0px', threshold: 0 },
      );
      this.scrollStateObserver.observe(scrollSentinel);
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) this.activeSection.set(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.25, 0.5] },
    );

    for (const item of this.navigation()) {
      const section = this.document.getElementById(item.id);
      if (section) this.sectionObserver.observe(section);
    }
  }

  ngOnDestroy(): void {
    this.sectionObserver?.disconnect();
    this.scrollStateObserver?.disconnect();
    this.document.body.classList.remove('menu-open');
  }

  @HostListener('window:hashchange')
  protected onHashChange(): void {
    const id = this.document.defaultView?.location.hash.slice(1);
    if (id) this.activeSection.set(id);
  }

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu(true);
    } else if (event.key === 'Tab') {
      this.trapMenuFocus(event);
    }
  }

  @HostListener('window:resize')
  protected closeMobileMenuOnDesktop(): void {
    if ((this.document.defaultView?.innerWidth ?? 0) > 900 && this.menuOpen()) {
      this.closeMenu();
    }
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

  protected followNavigation(sectionId: string): void {
    const shouldMoveFocus = this.menuOpen();
    this.closeMenu();
    if (!shouldMoveFocus) return;

    this.document.defaultView?.setTimeout(() => {
      const section = this.document.getElementById(sectionId);
      if (!section) return;
      const alreadyFocusable = section.hasAttribute('tabindex');
      if (!alreadyFocusable) section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      if (!alreadyFocusable) {
        section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
      }
    });
  }

  private trapMenuFocus(event: KeyboardEvent): void {
    const view = this.document.defaultView;
    if (!view) return;
    const focusable = [
      ...this.host.nativeElement.querySelectorAll<HTMLElement>(
        '.menu-button, #primary-navigation a',
      ),
    ].filter((element) => {
      const style = view.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && this.document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && this.document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
