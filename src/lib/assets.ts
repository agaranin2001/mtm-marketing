// Central registry of static image paths served from `public/images`.
// Avoids scattering magic path strings across components; the folder structure
// here mirrors `public/images/*`. Values must stay byte-identical to the files
// on disk — update both together when assets are renamed or moved.

export const IMAGES = {
  brand: {
    logo: '/images/brand/logo.svg',
    logoHorizontal: '/images/brand/logo-horizontal.svg',
    favicon: '/images/brand/favicon.webp',
    faviconSvg: '/images/brand/favicon.svg',
  },
  olympicRings: '/images/olympic-rings.webp',
  landing: {
    hero: '/images/landing/hero.webp',
    heroEok: '/images/landing/hero-eok.webp',
    erkiNoolHero: '/images/landing/erki-nool-hero.webp',
    teamBanner: '/images/landing/team-banner.webp',
    la2028: '/images/landing/la2028.webp',
    illustration: '/images/landing/illustration.webp',
    steps: {
      step1: '/images/landing/steps/step-1.webp',
      step2: '/images/landing/steps/step-2.webp',
      step3: '/images/landing/steps/step-3.webp',
      step4: '/images/landing/steps/step-4.webp',
    },
    gallery: {
      gallery1: '/images/landing/gallery/gallery-1.webp',
      gallery2: '/images/landing/gallery/gallery-2.webp',
      gallery3: '/images/landing/gallery/gallery-3.webp',
      gallery4: '/images/landing/gallery/gallery-4.webp',
      gallery5: '/images/landing/gallery/gallery-5.webp',
      gallery6: '/images/landing/gallery/gallery-6.webp',
    },
  },
  features: {
    analytics: '/images/features/analytics.webp',
    nutrition: '/images/features/nutrition.webp',
    recovery: '/images/features/recovery.webp',
    team: '/images/features/team.webp',
    training: '/images/features/training.webp',
  },
  modules: {
    event: '/images/modules/event.webp',
    nutrition: '/images/modules/nutrition.webp',
    recovery: '/images/modules/recovery.webp',
    training: '/images/modules/training.webp',
  },
  people: {
    alekseiGaranin: '/images/people/aleksei-garanin.webp',
    evenTudeberg: '/images/people/even-tudeberg.webp',
    mihhailPopov: '/images/people/mihhail-popov.webp',
    saskiaAlusalu: '/images/people/saskia-alusalu.webp',
  },
  customers: {
    adhamDjamalov: '/images/customers/adham-djamalov.webp',
    aigerimAbilkadirova: '/images/customers/aigerim-abilkadirova.webp',
    erkiNool: '/images/customers/erki-nool.webp',
    talalAlenezi: '/images/customers/talal-alenezi.webp',
    toniLettner: '/images/customers/toni-lettner.webp',
  },
  demo: {
    alika: '/images/demo/alika.webp',
    hedi: '/images/demo/hedi.webp',
    henriApri: '/images/demo/henri-apri.webp',
    koondis: '/images/demo/koondis.webp',
    session: '/images/demo/session.webp',
  },
  marketplace: {
    hero: '/images/marketplace/hero.webp',
  },
} as const
