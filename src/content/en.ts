import type { Content } from './types'

export const en: Content = {
  lang: 'en',
  dir: 'ltr',
  brand: {
    name: 'OMRAA AL QOMASH',
    tagline: 'جودة تنسج المستقبل',
  },
  ui: {
    // TODO(content): interface strings below are not in the PDF.
    menuOpen: 'Menu',
    menuClose: 'Close',
    carouselPause: 'Pause',
    carouselPlay: 'Play',
    skipToContent: 'Skip to content',
    languageSwitch: { label: 'العربية', targetLang: 'ar' },
    notFound: 'Page not found',
  },
  nav: [
    { label: 'Home', to: { route: 'home' } },
    { label: 'About Us', to: { route: 'about' } },
    { label: 'Contact Us', to: { route: 'contact' } },
  ],
  hero: {
    title: 'OMRAA AL QOMASH',
    descriptor: 'Egyptian Upholstery & Furnishing Fabric Manufacturer',
  },
  about: {
    title: 'About Us',
    paragraphs: [
      'OMRAA AL QOMASH is an Egyptian textile manufacturing and export company',
      'We specialize in manufacturing upholstery and furnishing fabrics designed to meet the needs of furniture manufacturers, interior designers, hospitality businesses, residential projects, and commercial applications.',
      'Our manufacturing capabilities, product variety, export experience, and understanding of upholstery fabrics allow us to serve B2B customers looking for a reliable long-term supply partner.',
      "We believe successful textile partnerships are built on more than competitive pricing. They require consistent quality, dependable production, clear communication, and the ability to deliver according to each customer's requirements.",
      'That is why we work to build long-term business relationships rather than one-time transactions.',
      'We combine Egyptian manufacturing capabilities with a business-focused approach to provide fabrics that meet the practical and aesthetic requirements of modern furniture and furnishing applications.',
      'Our quality management system is supported by ISO 9001 certification, reflecting our commitment to structured processes and consistent quality management.',
    ],
    isoLabel: 'ISO 9001',
    highlights: [
      'Factory-Direct Manufacturing',
      'Bulk Production',
      'Export Experience',
      'ISO 9001 Certified',
    ],
  },
  vision: {
    title: 'Our Vision',
    headline: 'To Become a Trusted Global Partner in Upholstery & Furnishing Fabrics.',
    body: [
      'Our vision is to establish OMRAA AL QOMASH as a recognized Egyptian manufacturer and trusted international supply partner for upholstery and furnishing fabrics.',
      'We aim to expand our presence across regional and international markets while continuously developing our products, manufacturing capabilities, quality standards, and customer experience.',
    ],
  },
  mission: {
    title: 'Our Mission',
    headline: 'Manufacturing Quality That Builds Long Term Partnerships.',
    body: [
      'Our mission is to manufacture and supply reliable upholstery and furnishing fabrics that meet the evolving needs of B2B customers in Egypt and international markets.',
    ],
  },
  products: {
    title: 'Our Products',
    headline: 'Upholstery Fabrics for Every Application.',
    intro:
      'We specialize in upholstery fabrics designed for furniture, furnishing, residential, commercial, hospitality, and interior applications.',
    listIntro: 'Our available fabric range includes:',
    items: [
      {
        slug: 'lycra',
        name: 'Lycra',
        description:
          'Flexible and versatile upholstery fabric suitable for a variety of furnishing applications.',
      },
      {
        slug: 'velvet',
        name: 'Velvet',
        description:
          'A rich and luxurious fabric that adds depth, softness, and an elegant appearance to upholstered furniture.',
      },
      {
        slug: 'double-chenille',
        name: 'Double Chenille',
        description:
          'A textured upholstery fabric offering a distinctive visual appearance and comfortable feel.',
      },
      {
        slug: 'ribbed-satin',
        name: 'Ribbed Satin',
        description:
          'A refined fabric option featuring a distinctive ribbed surface and elegant appearance.',
      },
      {
        slug: 'flat-satin',
        name: 'Flat Satin',
        description:
          'A smooth and sophisticated fabric suitable for modern upholstery and furnishing applications.',
      },
      {
        slug: 'satin-fenkh',
        name: 'Satin Fenkh',
        description:
          'A distinctive satin-based upholstery fabric offering an elegant decorative finish.',
      },
      {
        slug: 'chicken-puffer',
        name: 'Chicken Puffer',
        description:
          'A textured upholstery fabric characterized by its distinctive surface and visual depth.',
      },
      {
        slug: 'gobelin',
        name: 'Gobelin',
        description:
          'A decorative woven-style fabric suitable for furniture and furnishing applications where pattern and visual character are important.',
      },
      {
        slug: 'mad-arabi',
        name: 'Mad Arabi',
        description:
          'An upholstery fabric option designed for furnishing and furniture applications.',
      },
      {
        slug: 'sunrise',
        name: 'Sunrise',
        description:
          'A versatile upholstery fabric available for a range of furnishing applications.',
      },
    ],
    note: 'Note: Product availability, colors, specifications, widths, and production options may vary according to current collections and production requirements.',
    cta: {
      catalogue: 'Request Our Catalogue',
      samples: 'Request Product Samples',
      quote: 'Request a Quote',
    },
  },
  manufacture: {
    title: 'What We Manufacture',
    headline: 'Upholstery & Furnishing Fabrics',
    intro:
      'Our core product offering is focused on fabrics for upholstery and furnishing applications.',
    items: [
      {
        slug: 'sofas-chairs',
        title: 'Sofas & Chairs',
        description: 'Fabric solutions for residential and commercial seating.',
      },
      {
        slug: 'beds-headboards',
        title: 'Beds & Headboards',
        description: 'Upholstery fabrics for beds, headboards, and bedroom furniture.',
      },
      {
        slug: 'furniture-upholstery',
        title: 'Furniture Upholstery',
        description: 'Materials suitable for furniture manufacturers and upholstery businesses.',
      },
      {
        slug: 'residential-projects',
        title: 'Residential Projects',
        description:
          'Fabric solutions for homes, villas, apartments, and residential furnishing projects.',
      },
      {
        slug: 'commercial-projects',
        title: 'Commercial Projects',
        description:
          'Supporting furniture and furnishing requirements for offices, retail spaces, and commercial environments.',
      },
      {
        slug: 'hospitality-interior-projects',
        title: 'Hospitality & Interior Projects',
        description:
          'Fabric solutions for hotels, restaurants, hospitality spaces, interior projects, and other high-use environments.',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    headline: "Let's Build Your Next Supply Partnership.",
    intro:
      'Whether you are looking for upholstery fabrics, bulk production, custom manufacturing, samples, or export supply, our team is ready to discuss your requirements.',
    phone: { label: 'Phone', value: '01208000040' },
    whatsapp: { label: 'WhatsApp', value: '012 03406666' },
    location: { label: 'Based In', value: 'Badr City, Egypt' },
    email: { label: 'Email' },
    instagram: { label: 'Instagram' },
    facebook: { label: 'Facebook' },
    inquiries: {
      label: 'Business Inquiries',
      text: 'For quotations, samples, catalogues, export inquiries, and custom manufacturing requirements, contact our team directly.',
    },
  },
  footer: {
    brandName: 'OMRAA AL QOMASH',
    descriptor: 'Egyptian Upholstery & Furnishing Fabric Manufacturer',
    // PDF reads "Factory-Direct Manufacturing | Bulk Production | Experience | ISO 9001 Certified"
    // with the word "Export" detached above it; the Arabic says "خبرة في التصدير" → "Export Experience".
    highlights: [
      'Factory-Direct Manufacturing',
      'Bulk Production',
      'Export Experience',
      'ISO 9001 Certified',
    ],
    columns: [
      {
        title: 'Products',
        links: [
          { label: 'Upholstery Fabrics', to: { route: 'home', hash: 'products' } },
          { label: 'Furnishing Fabrics', to: { route: 'home', hash: 'products' } },
          // TODO(content): no dedicated "Custom Manufacturing" section — links to Contact.
          { label: 'Custom Manufacturing', to: { route: 'contact' } },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About Us', to: { route: 'about' } },
          { label: 'Vision & Mission', to: { route: 'about', hash: 'vision' } },
          // TODO(content): "Quality" has no dedicated page; links to the ISO 9001 block.
          { label: 'Quality', to: { route: 'about', hash: 'quality' } },
          // TODO(content): "Export Markets" has no section anywhere in the PDF.
          { label: 'Export Markets', to: { route: 'about' } },
        ],
      },
      {
        title: 'Business',
        links: [
          { label: 'Request a Quote', to: { route: 'contact' } },
          { label: 'Request Samples', to: { route: 'contact' } },
          { label: 'Request Catalogue', to: { route: 'contact' } },
        ],
      },
    ],
    contact: {
      title: 'Contact',
      phone: '01208000040',
      whatsapp: 'WhatsApp: 012 03406666',
      location: 'Badr City, Egypt',
      instagram: 'Instagram',
      facebook: 'Facebook',
    },
    copyright: '© 2026 Omraa Al Qomash. All Rights Reserved.',
  },
}
