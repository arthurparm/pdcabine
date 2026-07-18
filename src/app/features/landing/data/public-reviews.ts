export interface PublicReview {
  readonly id: string;
  readonly author: string;
  readonly context: string;
  readonly rating: 5;
  readonly summary: string;
}

export const PUBLIC_REVIEWS: readonly PublicReview[] = [
  {
    id: 'karina-casamento',
    author: 'Karina',
    context: 'Casamento',
    rating: 5,
    summary:
      'As fotos fizeram sucesso entre os convidados e a experiência se tornou um dos destaques da celebração.',
  },
  {
    id: 'priscila-casamento',
    author: 'Priscila',
    context: 'Casamento',
    rating: 5,
    summary:
      'O totem foi percebido como um diferencial da festa, com atendimento simpático e ótima participação dos convidados.',
  },
  {
    id: 'giovanna-casamento',
    author: 'Giovanna',
    context: 'Casamento',
    rating: 5,
    summary:
      'O totem inflável com fotos no estilo Polaroid, a arte personalizada e a atenção da equipe foram muito elogiados.',
  },
  {
    id: 'joao-casamento',
    author: 'João',
    context: 'Casamento',
    rating: 5,
    summary:
      'Pontualidade, atendimento e qualidade das fotografias foram os pontos mais destacados.',
  },
  {
    id: 'suzanne-espelho-magico',
    author: 'Suzanne',
    context: 'Evento com Espelho Mágico',
    rating: 5,
    summary: 'O Espelho Mágico envolveu os convidados e recebeu muitos elogios durante a festa.',
  },
  {
    id: 'vanessa-plataforma-totem',
    author: 'Vanessa',
    context: 'Evento com plataforma e totem',
    rating: 5,
    summary:
      'A plataforma e o totem animaram os convidados, enquanto a equipe auxiliou na personalização da experiência.',
  },
  {
    id: 'thalita-casamento',
    author: 'Thalita',
    context: 'Casamento',
    rating: 5,
    summary:
      'A PD Cabine foi lembrada como um dos destaques da festa pelo empenho, atenção e envolvimento com os convidados.',
  },
  {
    id: 'jathyara-casamento',
    author: 'Jathyara',
    context: 'Casamento',
    rating: 5,
    summary:
      'O layout personalizado das fotografias e a flexibilidade durante a criação da arte foram muito valorizados.',
  },
];
