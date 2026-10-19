/**
 * Contact channels, confirmed by the client (email, Instagram and Facebook are not in the PDF).
 * Shared by both languages. `display` is the shown value, `href` the link target.
 */
export const channels = {
  phone: { display: '01208000040', href: 'tel:+201208000040' },
  whatsapp: { display: '012 03406666', href: 'https://wa.me/201203406666' },
  email: { display: 'omaraatextiles@gmail.com', href: 'mailto:omaraatextiles@gmail.com' },
  instagram: {
    display: 'omraa_textiles',
    href: 'https://www.instagram.com/omraa_textiles/',
  },
  facebook: {
    display: 'Omraa textiles',
    href: 'https://www.facebook.com/profile.php?id=61594206881800',
  },
} as const
