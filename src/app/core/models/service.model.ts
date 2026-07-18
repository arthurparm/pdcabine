export type ServiceId =
  | 'totem-fotografico'
  | 'totem-retro'
  | 'cabine-tradicional'
  | 'cabine-inflavel'
  | 'espelho-magico'
  | 'plataformas-video'
  | 'plataforma-360'
  | 'plataforma-180'
  | 'tunel-infinity'
  | 'caderno-assinaturas';

export interface Service {
  readonly id: ServiceId;
  readonly name: string;
  readonly summary: string;
}
