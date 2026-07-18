import { Component, signal } from '@angular/core';
import { SITE_CONFIG } from '../../core/config/site.config';
import type { ServiceId } from '../../core/models/service.model';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ExperienceGalleryComponent } from './components/experience-gallery/experience-gallery.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { SocialProofComponent } from './components/social-proof/social-proof.component';
import { TestimonialsCarouselComponent } from './components/testimonials-carousel/testimonials-carousel.component';
import { WhatsappFloatingButtonComponent } from './components/whatsapp-floating-button/whatsapp-floating-button.component';
import { VisualHighlightComponent } from './components/visual-highlight/visual-highlight.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    HeaderComponent,
    HeroComponent,
    VisualHighlightComponent,
    ServicesComponent,
    ExperienceGalleryComponent,
    SocialProofComponent,
    TestimonialsCarouselComponent,
    ContactSectionComponent,
    FooterComponent,
    WhatsappFloatingButtonComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  protected readonly config = SITE_CONFIG;
  protected readonly selectedServiceId = signal<ServiceId | ''>('');
  protected readonly heroImages = {
    primary: SITE_CONFIG.gallery[8],
    secondary: SITE_CONFIG.gallery[1],
    tertiary: SITE_CONFIG.gallery[5]
  };
  protected readonly highlightImages = {
    primary: SITE_CONFIG.gallery.find((image) => image.id === 'tirinhas-casamento')!,
    secondary: SITE_CONFIG.gallery.find((image) => image.id === 'familia')!,
    tertiary: SITE_CONFIG.gallery.find((image) => image.id === 'noiva-polaroids')!
  };

  protected selectService(serviceId: ServiceId): void {
    this.selectedServiceId.set(serviceId);
  }
}
