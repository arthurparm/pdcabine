import { createWhatsAppUrl, SITE_CONFIG } from './site.config';

describe('SITE_CONFIG', () => {
  it('normalizes and encodes the WhatsApp contact in one place', () => {
    expect(SITE_CONFIG.whatsapp.normalized).toMatch(/^\d{13}$/);
    expect(SITE_CONFIG.whatsapp.url).toBe(
      createWhatsAppUrl(SITE_CONFIG.whatsapp.normalized, SITE_CONFIG.whatsapp.defaultMessage),
    );
    expect(SITE_CONFIG.whatsapp.url).toContain('Ol%C3%A1%2C%20PD%20Cabine');
  });

  it('keeps navigation and service identifiers unique', () => {
    const navigationIds = SITE_CONFIG.navigation.map((item) => item.id);
    const serviceIds = SITE_CONFIG.services.map((service) => service.id);

    expect(new Set(navigationIds).size).toBe(navigationIds.length);
    expect(new Set(serviceIds).size).toBe(serviceIds.length);
    expect(SITE_CONFIG.services).toHaveLength(7);
    expect(
      SITE_CONFIG.services.every((service) =>
        SITE_CONFIG.gallery.some((image) => image.id === service.imageId),
      ),
    ).toBe(true);
  });

  it('references both optimized and fallback formats for every photograph', () => {
    expect(SITE_CONFIG.gallery).toHaveLength(10);
    expect(SITE_CONFIG.gallery.every((image) => image.jpegSrc.endsWith('.jpeg'))).toBe(true);
    expect(SITE_CONFIG.gallery.every((image) => image.webpSrc.endsWith('.webp'))).toBe(true);
    expect(
      SITE_CONFIG.gallery.every(
        (image) =>
          image.webpSrcSet.includes('240w') &&
          image.webpSrcSet.includes('320w') &&
          image.webpSrcSet.includes('480w') &&
          image.webpSrcSet.includes('800w'),
      ),
    ).toBe(true);
    expect(SITE_CONFIG.gallery.every((image) => image.width > 0 && image.height > 0)).toBe(true);
    expect(
      SITE_CONFIG.gallery.every((image) => image.alt.length > 20 && image.caption.length > 20),
    ).toBe(true);
    expect(SITE_CONFIG.gallery.every((image) => image.objectPosition.length > 0)).toBe(true);
    expect(
      SITE_CONFIG.services.every((service) => {
        const image = SITE_CONFIG.gallery.find((candidate) => candidate.id === service.imageId);
        return image && 'cardWebpSrcSet' in image && Boolean(image.cardWebpSrcSet);
      }),
    ).toBe(true);
  });

  it('keeps the supplied public social proof in central configuration', () => {
    expect(SITE_CONFIG.socialProof.metrics).toHaveLength(5);
    expect(SITE_CONFIG.socialProof.rating).toBe('5,0');
    expect(SITE_CONFIG.socialProof.reviewCount).toBe(246);
    expect(SITE_CONFIG.socialProof.verification.verifiedAt).toBe('2026-07-18');
  });
});
