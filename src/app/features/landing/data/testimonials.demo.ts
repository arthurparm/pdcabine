import type { Testimonial } from '../../../core/models/testimonial.model';

export const DEMO_TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 'demo-casamento',
    quote: 'Exemplo de feedback: a experiência trouxe leveza e diversão para os convidados.',
    author: 'Cliente demonstrativo',
    eventType: 'Casamento — conteúdo não publicado',
    isPlaceholder: true
  },
  {
    id: 'demo-aniversario',
    quote: 'Exemplo de feedback: as fotos se tornaram uma lembrança especial da comemoração.',
    author: 'Cliente demonstrativo',
    eventType: 'Aniversário — conteúdo não publicado',
    isPlaceholder: true
  }
];
