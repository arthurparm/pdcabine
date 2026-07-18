import type { GalleryImage } from '../models/gallery-image.model';
import type { NavigationItem } from '../models/navigation-item.model';
import type { Service } from '../models/service.model';

export interface SocialProofMetric {
  readonly label: string;
  readonly value: string;
  readonly source: string;
  readonly animatedValue?: {
    readonly target: number;
    readonly decimals: number;
    readonly prefix?: string;
    readonly suffix?: string;
  };
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
  readonly slogan: string;
  readonly cnpj: string;
  readonly serviceRegion: string;
  readonly logoPath: string;
  readonly logoSrcSet: string;
  readonly whatsapp: {
    readonly normalized: string;
    readonly display: string;
    readonly defaultMessage: string;
    readonly url: string;
  };
  readonly contact: {
    readonly title: string;
    readonly description: string;
    readonly privacyNotice: string;
    readonly messageMaxLength: number;
    readonly eventTypes: readonly string[];
    readonly serviceOptions: readonly { readonly id: string; readonly label: string }[];
    readonly serviceSelectionMap: Readonly<Record<Service['id'], readonly string[]>>;
  };
  readonly instagram: {
    readonly handle: string;
    readonly url: string;
  };
  readonly reviews: {
    readonly label: string;
    readonly url: string;
  };
  readonly navigation: readonly NavigationItem[];
  readonly services: readonly Service[];
  readonly gallery: readonly GalleryImage[];
  readonly socialProof: {
    readonly rating: string;
    readonly reviewCount: number;
    readonly recommendationRate: string;
    readonly metrics: readonly SocialProofMetric[];
    readonly verification: PublicDataVerification;
  };
}

const ASSET_PATH = '/assets/images/pd-cabine';
const RESPONSIVE_IMAGE_WIDTHS = [240, 320, 480, 800] as const;
const LOGO_SRC_SET = [64, 128, 192, 384]
  .map((width) => `${ASSET_PATH}/logo-pd-cabine-${width}.webp ${width}w`)
  .join(', ');
const WHATSAPP_NUMBER = '5511999892708';
const WHATSAPP_MESSAGE =
  'Olá, PD Cabine! Conheci o trabalho de vocês pelo site e gostaria de solicitar um orçamento.';

export function createWhatsAppUrl(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function createWebpSrcSet(source: string, intrinsicWidth: number): string {
  const extensionIndex = source.lastIndexOf('.');
  const basePath = source.slice(0, extensionIndex);
  const extension = source.slice(extensionIndex);
  return [
    ...RESPONSIVE_IMAGE_WIDTHS.filter((width) => width < intrinsicWidth).map(
      (width) => `${basePath}-${width}${extension} ${width}w`,
    ),
    `${source} ${intrinsicWidth}w`,
  ].join(', ');
}

function createCardWebpSrcSet(source: string): string {
  const extensionIndex = source.lastIndexOf('.');
  const basePath = source.slice(0, extensionIndex);
  const extension = source.slice(extensionIndex);
  return [480, 800].map((width) => `${basePath}-card-${width}${extension} ${width}w`).join(', ');
}

const whatsappUrl = createWhatsAppUrl(WHATSAPP_NUMBER, WHATSAPP_MESSAGE);
const instagramUrl = 'https://www.instagram.com/pdcabine/';

export const SITE_CONFIG = {
  companyName: 'PD Cabine',
  slogan: 'Capturando momentos, criando memórias.',
  cnpj: '39.487.633/0001-01',
  serviceRegion: 'São Paulo',
  logoPath: `${ASSET_PATH}/logo-pd-cabine.png`,
  logoSrcSet: LOGO_SRC_SET,
  whatsapp: {
    normalized: WHATSAPP_NUMBER,
    display: '(11) 99989-2708',
    defaultMessage: WHATSAPP_MESSAGE,
    url: whatsappUrl,
  },
  contact: {
    title: 'Vamos criar uma experiência inesquecível?',
    description:
      'Conte um pouco sobre o seu evento. A PD Cabine prepara uma solicitação de orçamento com as informações necessárias para agilizar o atendimento.',
    privacyNotice:
      'Os dados preenchidos são usados apenas para preparar sua solicitação e não são armazenados por esta página.',
    messageMaxLength: 600,
    eventTypes: [
      'Casamento',
      'Aniversário',
      'Festa infantil',
      'Debutante',
      'Formatura',
      'Evento corporativo',
      'Confraternização',
      'Outro',
    ],
    serviceOptions: [
      { id: 'totem-fotografico', label: 'Totem fotográfico' },
      { id: 'totem-retro', label: 'Totem retrô' },
      { id: 'cabine-tradicional', label: 'Cabine tradicional' },
      { id: 'cabine-inflavel', label: 'Cabine inflável' },
      { id: 'espelho-magico', label: 'Espelho mágico' },
      { id: 'plataforma-360', label: 'Plataforma 360°' },
      { id: 'plataforma-180', label: 'Plataforma 180°' },
      { id: 'tunel-infinity', label: 'Túnel Infinity' },
      { id: 'caderno-assinaturas', label: 'Caderno de assinaturas' },
      { id: 'nao-decidido', label: 'Ainda não decidi' },
    ],
    serviceSelectionMap: {
      'totem-fotografico': ['totem-fotografico'],
      'totem-retro': ['totem-retro'],
      cabines: ['cabine-tradicional', 'cabine-inflavel'],
      'espelho-magico': ['espelho-magico'],
      'plataformas-video': ['plataforma-360', 'plataforma-180'],
      'tunel-infinity': ['tunel-infinity'],
      'caderno-assinaturas': ['caderno-assinaturas'],
    },
  },
  instagram: {
    handle: '@pdcabine',
    url: instagramUrl,
  },
  reviews: {
    label: 'Casamentos.com.br',
    url: 'https://www.casamentos.com.br/cabine-de-fotos/pd-cabine--e269740',
  },
  navigation: [
    { id: 'inicio', label: 'Início', href: '#inicio' },
    { id: 'experiencias', label: 'Experiências', href: '#experiencias' },
    { id: 'galeria', label: 'Galeria', href: '#galeria' },
    { id: 'avaliacoes', label: 'Avaliações', href: '#avaliacoes' },
    { id: 'orcamento', label: 'Orçamento', href: '#orcamento' },
  ],
  services: [
    {
      id: 'totem-fotografico',
      name: 'Totem fotográfico',
      summary:
        'Fotos impressas em poucos segundos, moldura personalizada e uma experiência simples para os convidados aproveitarem quantas vezes desejarem conforme o pacote contratado.',
      imageId: 'totem-aderecos',
    },
    {
      id: 'totem-retro',
      name: 'Totem retrô',
      summary:
        'O charme de uma câmera clássica combinado com tecnologia atual, ideal para casamentos, festas elegantes e eventos com identidade vintage.',
      imageId: 'totem-retro',
    },
    {
      id: 'cabines',
      name: 'Cabines tradicional e inflável',
      summary:
        'Um espaço divertido e envolvente para reunir amigos, escolher os acessórios e criar sequências de fotos personalizadas.',
      imageId: 'festa-infantil',
    },
    {
      id: 'espelho-magico',
      name: 'Espelho mágico',
      summary:
        'Uma experiência fotográfica interativa em um grande espelho, com iluminação, animações e presença marcante na decoração.',
      imageId: 'espelho-magico',
    },
    {
      id: 'plataformas-video',
      name: 'Plataformas de vídeo',
      summary:
        'Registros dinâmicos para colocar os convidados no centro da ação, com opções como plataformas 360° e 180°.',
      imageId: 'plataforma-360',
    },
    {
      id: 'tunel-infinity',
      name: 'Túnel Infinity',
      summary:
        'Um corredor imersivo de luzes e reflexos para entradas impactantes, vídeos criativos e registros com estética futurista.',
      imageId: 'tunel-infinity',
    },
    {
      id: 'caderno-assinaturas',
      name: 'Caderno de assinaturas',
      summary:
        'Um espaço para combinar fotografias impressas com mensagens dos convidados e transformar o evento em uma recordação física completa.',
      imageId: 'caderno-assinaturas',
    },
  ],
  gallery: [
    {
      id: 'festa-infantil',
      jpegSrc: `${ASSET_PATH}/festa-infantil-fotos-impressas.jpeg`,
      webpSrc: `${ASSET_PATH}/festa-infantil-fotos-impressas.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/festa-infantil-fotos-impressas.webp`, 1200),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/festa-infantil-fotos-impressas.webp`),
      alt: 'Tirinhas fotográficas personalizadas de uma festa infantil.',
      caption: 'Lembranças impressas e personalizadas para uma festa infantil.',
      width: 1200,
      height: 1600,
      objectPosition: '50% 48%',
      gridSpan: 'feature',
    },
    {
      id: 'noiva-polaroids',
      jpegSrc: `${ASSET_PATH}/noiva-com-polaroids.jpeg`,
      webpSrc: `${ASSET_PATH}/noiva-com-polaroids.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/noiva-com-polaroids.webp`, 1206),
      alt: 'Noiva sorrindo e segurando duas fotografias personalizadas.',
      caption: 'A noiva com as fotografias personalizadas do casamento.',
      width: 1206,
      height: 1563,
      objectPosition: '50% 25%',
      gridSpan: 'tall',
    },
    {
      id: 'totem-aderecos',
      jpegSrc: `${ASSET_PATH}/totem-fotografico-com-aderecos.jpeg`,
      webpSrc: `${ASSET_PATH}/totem-fotografico-com-aderecos.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/totem-fotografico-com-aderecos.webp`, 1200),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/totem-fotografico-com-aderecos.webp`),
      alt: 'Totem fotográfico preto instalado ao lado de acessórios coloridos.',
      caption: 'Totem fotográfico e acessórios preparados para os convidados.',
      width: 1200,
      height: 1600,
      objectPosition: '50% 80%',
      gridSpan: 'standard',
    },
    {
      id: 'familia',
      jpegSrc: `${ASSET_PATH}/fotos-personalizadas-familia.jpeg`,
      webpSrc: `${ASSET_PATH}/fotos-personalizadas-familia.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/fotos-personalizadas-familia.webp`, 900),
      alt: 'Fotografias personalizadas de uma família durante uma celebração.',
      caption: 'Registros personalizados de uma família durante a festa.',
      width: 900,
      height: 1600,
      objectPosition: '50% 46%',
      gridSpan: 'standard',
    },
    {
      id: 'totem-retro',
      jpegSrc: `${ASSET_PATH}/totem-retro-evento.jpeg`,
      webpSrc: `${ASSET_PATH}/totem-retro-evento.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/totem-retro-evento.webp`, 1086),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/totem-retro-evento.webp`),
      alt: 'Totem fotográfico retrô com tripé de madeira e mesa de acessórios.',
      caption: 'Totem retrô integrado à decoração do evento.',
      width: 1086,
      height: 1448,
      objectPosition: '50% 78%',
      gridSpan: 'wide',
    },
    {
      id: 'plataforma-360',
      jpegSrc: `${ASSET_PATH}/plataforma-360-evento.jpeg`,
      webpSrc: `${ASSET_PATH}/plataforma-360-evento.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/plataforma-360-evento.webp`, 1086),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/plataforma-360-evento.webp`),
      alt: 'Plataforma 360 com iluminação em espiral instalada em espaço para eventos.',
      caption: 'Plataforma 360 com espiral luminosa pronta para receber os convidados.',
      width: 1086,
      height: 1448,
      objectPosition: '50% 76%',
      gridSpan: 'tall',
    },
    {
      id: 'espelho-magico',
      jpegSrc: `${ASSET_PATH}/espelho-magico-evento.jpeg`,
      webpSrc: `${ASSET_PATH}/espelho-magico-evento.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/espelho-magico-evento.webp`, 1117),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/espelho-magico-evento.webp`),
      alt: 'Espelho mágico com moldura dourada instalado em um evento.',
      caption: 'Espelho mágico com moldura de destaque e interação em tela.',
      width: 1117,
      height: 1408,
      objectPosition: '50% 52%',
      gridSpan: 'standard',
    },
    {
      id: 'tirinhas-casamento',
      jpegSrc: `${ASSET_PATH}/tirinhas-fotograficas-casamento.jpeg`,
      webpSrc: `${ASSET_PATH}/tirinhas-fotograficas-casamento.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/tirinhas-fotograficas-casamento.webp`, 1206),
      alt: 'Tirinhas de fotos de casamento diante de uma decoração floral.',
      caption: 'Tirinhas personalizadas do casamento diante da decoração floral.',
      width: 1206,
      height: 1563,
      objectPosition: '50% 44%',
      gridSpan: 'wide',
    },
    {
      id: 'tunel-infinity',
      jpegSrc: `${ASSET_PATH}/tunel-infinity-com-totem.jpeg`,
      webpSrc: `${ASSET_PATH}/tunel-infinity-com-totem.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/tunel-infinity-com-totem.webp`, 1114),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/tunel-infinity-com-totem.webp`),
      alt: 'Túnel Infinity iluminado ao lado de um totem fotográfico.',
      caption: 'Túnel Infinity e totem fotográfico compondo uma experiência imersiva.',
      width: 1114,
      height: 1412,
      objectPosition: '50% 58%',
      gridSpan: 'feature',
    },
    {
      id: 'caderno-assinaturas',
      jpegSrc: `${ASSET_PATH}/caderno-de-assinaturas.jpeg`,
      webpSrc: `${ASSET_PATH}/caderno-de-assinaturas.webp`,
      webpSrcSet: createWebpSrcSet(`${ASSET_PATH}/caderno-de-assinaturas.webp`, 1200),
      cardWebpSrcSet: createCardWebpSrcSet(`${ASSET_PATH}/caderno-de-assinaturas.webp`),
      alt: 'Caderno de assinaturas aberto com canetas sobre uma mesa decorada.',
      caption: 'Caderno preparado para reunir fotografias e mensagens dos convidados.',
      width: 1200,
      height: 1600,
      objectPosition: '50% 50%',
      gridSpan: 'standard',
    },
  ],
  socialProof: {
    rating: '5,0',
    reviewCount: 246,
    recommendationRate: '100%',
    metrics: [
      {
        value: '5,0',
        label: 'Nota média',
        source: 'Plataforma pública de avaliações',
        animatedValue: { target: 5, decimals: 1 },
      },
      {
        value: '246',
        label: 'avaliações públicas',
        source: 'Plataforma pública de avaliações',
        animatedValue: { target: 246, decimals: 0 },
      },
      {
        value: '+350',
        label: 'casais contrataram',
        source: 'Histórico público da empresa',
        animatedValue: { target: 350, decimals: 0, prefix: '+' },
      },
      { value: '2022–2026', label: 'Casamentos Awards', source: 'Casamentos.com.br' },
      {
        value: '100%',
        label: 'de recomendação',
        source: 'Plataforma pública de avaliações',
        animatedValue: { target: 100, decimals: 0, suffix: '%' },
      },
    ],
    verification: {
      verifiedAt: '2026-07-18',
      displayLabel: 'julho de 2026',
      registryStatus: 'active',
      registryCity: 'São Paulo',
      registryState: 'SP',
      source: 'BrasilAPI — consulta pública de CNPJ',
      note: 'O nome institucional informado no briefing não foi tratado como razão social registrada.',
    },
  },
} as const satisfies SiteConfig;
