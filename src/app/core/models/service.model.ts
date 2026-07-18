export type ServiceId =
  | 'totem-fotografico'
  | 'totem-retro'
  | 'cabines'
  | 'espelho-magico'
  | 'plataformas-video'
  | 'tunel-infinity'
  | 'caderno-assinaturas';

export interface Service {
  readonly id: ServiceId;
  readonly name: string;
  readonly summary: string;
  readonly imageId: string;
}
