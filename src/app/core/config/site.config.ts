import type { GalleryImage } from '../models/gallery-image.model';
import type { NavigationItem } from '../models/navigation-item.model';
import type { Service } from '../models/service.model';
import type { Testimonial } from '../models/testimonial.model';

export interface SocialLink {
  readonly kind: 'instagram' | 'whatsapp';
  readonly label: string;
  readonly url: string;
}

export interface SocialProofMetric {
  readonly label: string;
  readonly value: string;
  readonly source: string;
}

export interface PublicDataVerification {
  readonly verifiedAt: string;
  readonly displayLabel: string;
  readonly registryStatus: 'active';
  readonly registryCity: string;
  readonly registryState: string;
  readonly source: string;
  readonly note: string;
}

export interface SiteConfig {
  readonly companyName: string;
  readonly institutionalName: string;
  readonly slogan: string;
  readonly cnpj: string;
  readonly serviceRegion: string;
  readonly logoPath: string;
  readonly whatsapp: {
    readonly normalized: string;
    readonly display: string;
    readonly defaultMessage: string;
    readonly url: string;
  };
  readonly instagram: {
    readonly handle: string;
    readonly url: string;
  };
  readonly socialLinks: readonly SocialLink[];
  readonly navigation: readonly NavigationItem[];
  readonly services: readonly Service[];
  readonly gallery: readonly GalleryImage[];
  readonly socialProof: {
    readonly rating: string;
    readonly reviewCount: number;
    readonly recommendationRate: string;
    readonly metrics: readonly SocialProofMetric[];
    readonly testimonials: readonly Testimonial[];
    readonly verification: PublicDataVerification;
  };
}

const ASSET_PATH = '/assets/images/pd-cabine';
const WHATSAPP_NUMBER = '5511999892708';
const WHATSAPP_MESSAGE =
  'Olá, PD Cabine! Gostaria de solicitar um orçamento para o meu evento.';

export function createWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const whatsappUrl = createWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
const instagramUrl = 'https://www.instagram.com/pdcabine/';

export const SITE_CONFIG = {
  companyName: 'PD Cabine',
  institutionalName: 'PD Eventos',
  slogan: 'Capturando momentos, criando memórias.',
  cnpj: '39.487.633/0001-01',
  serviceRegion: 'São Paulo',
  logoPath: `${ASSET_PATH}/logo-pd-cabine.png`,
  whatsapp: {
    normalized: WHATSAPP_NUMBER,
    display: '(11) 99989-2708',
    defaultMessage: WHATSAPP_MESSAGE,
    url: whatsappUrl
  },
  instagram: {
    handle: '@pdcabine',
    url: instagramUrl
  },
  socialLinks: [
    { kind: 'instagram', label: 'Instagram da PD Cabine', url: instagramUrl },
    { kind: 'whatsapp', label: 'WhatsApp da PD Cabine', url: whatsappUrl }
  ],
  navigation: [
    { id: 'inicio', label: 'Início', href: '#inicio' },
    { id: 'experiencias', label: 'Experiências', href: '#experiencias' },
    { id: 'galeria', label: 'Galeria', href: '#galeria' },
    { id: 'avaliacoes', label: 'Avaliações', href: '#avaliacoes' },
    { id: 'orcamento', label: 'Orçamento', href: '#orcamento' }
  ],
  services: [
    { id: 'totem-fotografico', name: 'Totem fotográfico', summary: 'Fotos personalizadas e impressas durante o evento.' },
    { id: 'totem-retro', name: 'Totem retrô', summary: 'Experiência fotográfica com acabamento clássico em madeira.' },
    { id: 'cabine-tradicional', name: 'Cabine tradicional', summary: 'Privacidade e diversão para fotos espontâneas.' },
    { id: 'cabine-inflavel', name: 'Cabine inflável', summary: 'Uma cabine de presença marcante e montagem versátil.' },
    { id: 'espelho-magico', name: 'Espelho mágico', summary: 'Interação em tela espelhada com moldura elegante.' },
    { id: 'plataformas-video', name: 'Plataformas para vídeos', summary: 'Registros em movimento prontos para compartilhar.' },
    { id: 'plataforma-360', name: 'Plataforma 360°', summary: 'Vídeos envolventes capturados em todos os ângulos.' },
    { id: 'plataforma-180', name: 'Plataforma 180°', summary: 'Movimento cinematográfico em formato compacto.' },
    { id: 'tunel-infinity', name: 'Túnel Infinity', summary: 'Corredor de luz para uma experiência visual imersiva.' },
    { id: 'caderno-assinaturas', name: 'Caderno de assinaturas', summary: 'Mensagens e fotos reunidas em uma lembrança física.' }
  ],
  gallery: [
    { id: 'festa-infantil', jpegSrc: `${ASSET_PATH}/festa-infantil-fotos-impressas.jpeg`, webpSrc: `${ASSET_PATH}/festa-infantil-fotos-impressas.webp`, alt: 'Duas tirinhas fotográficas personalizadas de uma festa infantil', width: 1200, height: 1600, serviceId: 'totem-fotografico' },
    { id: 'noiva-polaroids', jpegSrc: `${ASSET_PATH}/noiva-com-polaroids.jpeg`, webpSrc: `${ASSET_PATH}/noiva-com-polaroids.webp`, alt: 'Noiva sorrindo enquanto segura duas fotos estilo polaroid', width: 1206, height: 1563, serviceId: 'totem-fotografico' },
    { id: 'totem-aderecos', jpegSrc: `${ASSET_PATH}/totem-fotografico-com-aderecos.jpeg`, webpSrc: `${ASSET_PATH}/totem-fotografico-com-aderecos.webp`, alt: 'Totem fotográfico preto ao lado de suporte com adereços coloridos', width: 1200, height: 1600, serviceId: 'totem-fotografico' },
    { id: 'familia', jpegSrc: `${ASSET_PATH}/fotos-personalizadas-familia.jpeg`, webpSrc: `${ASSET_PATH}/fotos-personalizadas-familia.webp`, alt: 'Duas fotos personalizadas de uma família em uma festa', width: 900, height: 1600, serviceId: 'totem-fotografico' },
    { id: 'totem-retro', jpegSrc: `${ASSET_PATH}/totem-retro-evento.jpeg`, webpSrc: `${ASSET_PATH}/totem-retro-evento.webp`, alt: 'Totem fotográfico retrô com tripé de madeira e mesa de adereços', width: 1086, height: 1448, serviceId: 'totem-retro' },
    { id: 'plataforma-360', jpegSrc: `${ASSET_PATH}/plataforma-360-evento.jpeg`, webpSrc: `${ASSET_PATH}/plataforma-360-evento.webp`, alt: 'Plataforma 360 graus preta com espiral luminosa', width: 1086, height: 1448, serviceId: 'plataforma-360' },
    { id: 'espelho-magico', jpegSrc: `${ASSET_PATH}/espelho-magico-evento.jpeg`, webpSrc: `${ASSET_PATH}/espelho-magico-evento.webp`, alt: 'Espelho mágico com grande moldura dourada em um evento', width: 1117, height: 1408, serviceId: 'espelho-magico' },
    { id: 'tirinhas-casamento', jpegSrc: `${ASSET_PATH}/tirinhas-fotograficas-casamento.jpeg`, webpSrc: `${ASSET_PATH}/tirinhas-fotograficas-casamento.webp`, alt: 'Tirinhas fotográficas de casamento diante de um painel de flores', width: 1206, height: 1563, serviceId: 'cabine-tradicional' },
    { id: 'tunel-infinity', jpegSrc: `${ASSET_PATH}/tunel-infinity-com-totem.jpeg`, webpSrc: `${ASSET_PATH}/tunel-infinity-com-totem.webp`, alt: 'Túnel Infinity com LEDs coloridos ao lado de um totem fotográfico', width: 1114, height: 1412, serviceId: 'tunel-infinity' },
    { id: 'caderno-assinaturas', jpegSrc: `${ASSET_PATH}/caderno-de-assinaturas.jpeg`, webpSrc: `${ASSET_PATH}/caderno-de-assinaturas.webp`, alt: 'Caderno de assinaturas e canetas sobre uma mesa decorada', width: 1200, height: 1600, serviceId: 'caderno-assinaturas' }
  ],
  socialProof: {
    rating: '5,0',
    reviewCount: 246,
    recommendationRate: '100%',
    metrics: [
      { value: '5,0', label: 'Nota média', source: 'Plataforma pública de avaliações' },
      { value: '246', label: 'avaliações públicas', source: 'Plataforma pública de avaliações' },
      { value: '+350', label: 'casais contrataram', source: 'Histórico público da empresa' },
      { value: '2022–2026', label: 'Casamentos Awards', source: 'Casamentos.com.br' },
      { value: '100%', label: 'de recomendação', source: 'Plataforma pública de avaliações' }
    ],
    testimonials: [],
    verification: {
      verifiedAt: '2026-07-18',
      displayLabel: 'julho de 2026',
      registryStatus: 'active',
      registryCity: 'São Paulo',
      registryState: 'SP',
      source: 'BrasilAPI — consulta pública de CNPJ',
      note: 'O nome institucional informado no briefing não foi tratado como razão social registrada.'
    }
  }
} as const satisfies SiteConfig;
