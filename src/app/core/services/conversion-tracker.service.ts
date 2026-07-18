import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

export interface ConversionEvent {
  readonly name: 'budget_request_prepared';
  readonly channel: 'whatsapp';
}

@Injectable({ providedIn: 'root' })
export class ConversionTrackerService {
  private readonly document = inject(DOCUMENT);

  track(event: ConversionEvent): void {
    this.document.defaultView?.dispatchEvent(
      new CustomEvent('pd-cabine:conversion', { detail: event })
    );
  }
}
