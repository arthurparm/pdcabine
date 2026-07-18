import { DEMO_TESTIMONIALS } from './testimonials.demo';

describe('DEMO_TESTIMONIALS', () => {
  it('marks every non-production testimonial as placeholder content', () => {
    expect(DEMO_TESTIMONIALS.length).toBeGreaterThan(0);
    expect(DEMO_TESTIMONIALS.every((testimonial) => testimonial.isPlaceholder)).toBe(true);
    expect(DEMO_TESTIMONIALS.every((testimonial) => testimonial.author.includes('demonstrativo'))).toBe(true);
  });
});
