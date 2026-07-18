import { Component, input } from '@angular/core';
import type { SocialProofMetric } from '../../../../core/config/site.config';

@Component({
  selector: 'app-social-proof',
  templateUrl: './social-proof.component.html',
  styleUrl: './social-proof.component.scss'
})
export class SocialProofComponent {
  readonly metrics = input.required<readonly SocialProofMetric[]>();
  readonly verificationDate = input.required<string>();
}
