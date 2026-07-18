import type { ServiceId } from './service.model';

export type EventType =
  | 'aniversario'
  | 'casamento'
  | 'corporativo'
  | 'formatura'
  | 'outro';

export interface ContactRequest {
  readonly name: string;
  readonly phone: string;
  readonly email?: string;
  readonly eventType: EventType;
  readonly eventDate?: string;
  readonly city: string;
  readonly serviceIds: readonly ServiceId[];
  readonly guestCount?: number;
  readonly message: string;
  readonly privacyConsent: boolean;
}
