import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'
import {en} from '../../src/content/en'
import {picture, plain, text, videoField} from './helpers'

/** A list with a fixed number of items: the client edits the texts but cannot add or remove items. */
const fixedList = (o: {
  name: string
  en: string
  ar: string
  help: string
  helpAr: string
  count: number
  of: ReturnType<typeof defineArrayMember>
}) =>
  defineField({
    name: o.name,
    title: `${o.en} / ${o.ar}`,
    description: `${o.help}  —  ${o.helpAr}`,
    type: 'array',
    of: [o.of],
    options: {sortable: false, disableActions: ['add', 'remove', 'duplicate', 'addBefore', 'addAfter']},
    validation: (rule: Rule) => rule.required().length(o.count),
  })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rule = any

const inGroup = <T extends object>(field: T, group: string) => ({...field, group})

// ---------------------------------------------------------------------------------------------
// Site settings (one document)
// ---------------------------------------------------------------------------------------------
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings / إعدادات الموقع',
  type: 'document',
  groups: [
    {name: 'contact', title: 'Contact details / بيانات التواصل', default: true},
    {name: 'footer', title: 'Footer / أسفل الصفحة'},
    {name: 'brand', title: 'Brand / العلامة'},
  ],
  fields: [
    inGroup(
      plain({
        name: 'phone',
        en: 'Phone number',
        ar: 'رقم التليفون',
        help: 'Shown on the site and used for the call link. Write it as you dial it, e.g. 01208000040.',
        helpAr: 'بيظهر في الموقع وبيفتح الاتصال. اكتبه زي ما بتطلبه، مثلاً 01208000040.',
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'whatsapp',
        en: 'WhatsApp number',
        ar: 'رقم الواتساب',
        help: 'Shown on the site and opens a WhatsApp chat, e.g. 012 03406666.',
        helpAr: 'بيظهر في الموقع وبيفتح محادثة واتساب، مثلاً 012 03406666.',
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'email',
        en: 'Email',
        ar: 'البريد الإلكتروني',
        help: 'Shown on the site and opens the email app.',
        helpAr: 'بيظهر في الموقع وبيفتح تطبيق البريد.',
        rule: (rule) => rule.email(),
      }),
      'contact',
    ),
    inGroup(
      text({
        name: 'location',
        en: 'Address / location',
        ar: 'العنوان',
        help: 'The city shown in the contact section and the footer.',
        helpAr: 'المدينة اللي بتظهر في صفحة التواصل وأسفل الصفحة.',
        path: 'footer.contact.location',
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'instagramHandle',
        en: 'Instagram name',
        ar: 'اسم الانستجرام',
        help: 'The name shown next to the Instagram icon, e.g. omraa_textiles.',
        helpAr: 'الاسم اللي بيظهر جنب أيقونة الانستجرام.',
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'instagramUrl',
        en: 'Instagram link',
        ar: 'رابط الانستجرام',
        help: 'The full page address, starting with https://',
        helpAr: 'رابط الصفحة كامل، بيبدأ بـ https://',
        rule: (rule) => rule.uri({scheme: ['https']}),
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'facebookName',
        en: 'Facebook name',
        ar: 'اسم الفيسبوك',
        help: 'The name shown next to the Facebook icon.',
        helpAr: 'الاسم اللي بيظهر جنب أيقونة الفيسبوك.',
      }),
      'contact',
    ),
    inGroup(
      plain({
        name: 'facebookUrl',
        en: 'Facebook link',
        ar: 'رابط الفيسبوك',
        help: 'The full page address, starting with https://',
        helpAr: 'رابط الصفحة كامل، بيبدأ بـ https://',
        rule: (rule) => rule.uri({scheme: ['https']}),
      }),
      'contact',
    ),

    inGroup(
      text({
        name: 'brandName',
        en: 'Company name',
        ar: 'اسم الشركة',
        help: 'Shown in the footer, the browser tab and the loading screen.',
        helpAr: 'بيظهر أسفل الصفحة وفي عنوان التبويب وشاشة التحميل.',
        path: 'footer.brandName',
      }),
      'brand',
    ),
    inGroup(
      text({
        name: 'tagline',
        en: 'Tagline',
        ar: 'الشعار النصي',
        help: 'The short line under the logo.',
        helpAr: 'السطر القصير تحت اللوجو.',
        path: 'brand.tagline',
      }),
      'brand',
    ),

    inGroup(
      text({
        name: 'descriptor',
        en: 'Footer description',
        ar: 'وصف أسفل الصفحة',
        help: 'The sentence under the logo in the footer.',
        helpAr: 'الجملة تحت اللوجو أسفل الصفحة.',
        path: 'footer.descriptor',
      }),
      'footer',
    ),
    inGroup(
      fixedList({
        name: 'highlights',
        en: 'Footer highlights (4 lines)',
        ar: 'نقاط أسفل الصفحة (4 أسطر)',
        help: 'The four short lines under the description.',
        helpAr: 'الأسطر الأربعة القصيرة تحت الوصف.',
        count: en.footer.highlights.length,
        of: defineArrayMember({type: 'localeString'}),
      }),
      'footer',
    ),
    inGroup(
      fixedList({
        name: 'footerColumns',
        en: 'Footer link columns',
        ar: 'أعمدة روابط أسفل الصفحة',
        help: 'Edit the column titles and link names. The pages the links open cannot be changed here.',
        helpAr: 'عدّل عناوين الأعمدة وأسماء الروابط. الصفحات اللي بتفتحها الروابط مش بتتغير من هنا.',
        count: en.footer.columns.length,
        of: defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            text({
              name: 'title',
              en: 'Column title',
              ar: 'عنوان العمود',
              help: 'The heading of this column.',
              helpAr: 'عنوان العمود.',
              path: 'footer.columns.*.title',
            }),
            defineField({
              name: 'links',
              title: 'Links / الروابط',
              type: 'array',
              of: [defineArrayMember({type: 'localeString'})],
              options: {
                sortable: false,
                disableActions: ['add', 'remove', 'duplicate', 'addBefore', 'addAfter'],
              },
            }),
          ],
          preview: {select: {title: 'title.en'}},
        }),
      }),
      'footer',
    ),
    inGroup(
      text({
        name: 'footerContactTitle',
        en: 'Footer contact heading',
        ar: 'عنوان التواصل أسفل الصفحة',
        help: 'The heading above the phone and social links.',
        helpAr: 'العنوان فوق التليفون وروابط السوشيال.',
        path: 'footer.contact.title',
      }),
      'footer',
    ),
    inGroup(
      text({
        name: 'footerInstagramLabel',
        en: 'Instagram label (footer)',
        ar: 'كلمة انستجرام (أسفل الصفحة)',
        help: 'The word used for the Instagram link.',
        helpAr: 'الكلمة اللي بتظهر لرابط الانستجرام.',
        path: 'footer.contact.instagram',
      }),
      'footer',
    ),
    inGroup(
      text({
        name: 'footerFacebookLabel',
        en: 'Facebook label (footer)',
        ar: 'كلمة فيسبوك (أسفل الصفحة)',
        help: 'The word used for the Facebook link.',
        helpAr: 'الكلمة اللي بتظهر لرابط الفيسبوك.',
        path: 'footer.contact.facebook',
      }),
      'footer',
    ),
    inGroup(
      text({
        name: 'copyright',
        en: 'Copyright line',
        ar: 'سطر حقوق النشر',
        help: 'The last line of the footer.',
        helpAr: 'آخر سطر أسفل الصفحة.',
        path: 'footer.copyright',
      }),
      'footer',
    ),
  ],
  preview: {prepare: () => ({title: 'Site settings / إعدادات الموقع'})},
})

// ---------------------------------------------------------------------------------------------
// Home page (one document)
// ---------------------------------------------------------------------------------------------
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page / الصفحة الرئيسية',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero / أول الصفحة', default: true},
    {name: 'loader', title: 'Loading screen / شاشة التحميل'},
    {name: 'products', title: 'Products section / قسم المنتجات'},
    {name: 'manufacture', title: 'What we manufacture / ماذا نصنع'},
  ],
  fields: [
    inGroup(
      text({
        name: 'heroTitle',
        en: 'Hero title',
        ar: 'العنوان الكبير',
        help: 'The big title over the video.',
        helpAr: 'العنوان الكبير فوق الفيديو.',
        path: 'hero.title',
      }),
      'hero',
    ),
    inGroup(
      text({
        name: 'heroDescriptor',
        en: 'Hero tagline',
        ar: 'السطر تحت العنوان',
        help: 'The line under the big title.',
        helpAr: 'السطر تحت العنوان الكبير.',
        path: 'hero.descriptor',
      }),
      'hero',
    ),
    inGroup(
      videoField({
        name: 'heroVideo',
        en: 'Hero video',
        ar: 'فيديو أول الصفحة',
        help: 'The background video of the first screen.',
        helpAr: 'فيديو الخلفية في أول شاشة.',
      }),
      'hero',
    ),
    inGroup(
      videoField({
        name: 'loaderVideo',
        en: 'Loading-screen video',
        ar: 'فيديو شاشة التحميل',
        help: 'The video behind the logo while the site loads.',
        helpAr: 'الفيديو ورا اللوجو وقت تحميل الموقع.',
      }),
      'loader',
    ),
    inGroup(
      text({
        name: 'productsTitle',
        en: 'Products label',
        ar: 'عنوان قسم المنتجات',
        help: 'The small heading at the top of the products section.',
        helpAr: 'العنوان الصغير فوق قسم المنتجات.',
        path: 'products.title',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'productsListIntro',
        en: 'Products intro line',
        ar: 'جملة تمهيدية للمنتجات',
        help: 'The line on the other side of the heading.',
        helpAr: 'الجملة في الناحية التانية من العنوان.',
        path: 'products.listIntro',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'productsHeadline',
        en: 'Products big background statement',
        ar: 'الجملة الكبيرة ورا الكروت',
        help: 'The big sentence behind the moving product cards.',
        helpAr: 'الجملة الكبيرة ورا كروت المنتجات المتحركة.',
        path: 'products.headline',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'productsNote',
        en: 'Products note',
        ar: 'ملاحظة المنتجات',
        help: 'The note under the product cards.',
        helpAr: 'الملاحظة تحت كروت المنتجات.',
        path: 'products.note',
        long: true,
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'ctaCatalogue',
        en: 'Button 1: catalogue',
        ar: 'الزرار 1: الكتالوج',
        help: 'The big dark button.',
        helpAr: 'الزرار الغامق الكبير.',
        path: 'products.cta.catalogue',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'ctaSamples',
        en: 'Button 2: samples',
        ar: 'الزرار 2: العينات',
        help: 'The first text link.',
        helpAr: 'أول رابط نصي.',
        path: 'products.cta.samples',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'ctaQuote',
        en: 'Button 3: quote',
        ar: 'الزرار 3: عرض السعر',
        help: 'The second text link.',
        helpAr: 'تاني رابط نصي.',
        path: 'products.cta.quote',
      }),
      'products',
    ),
    inGroup(
      text({
        name: 'manufactureTitle',
        en: 'What we manufacture: label',
        ar: 'ماذا نصنع: العنوان الصغير',
        help: 'The small heading of the section.',
        helpAr: 'العنوان الصغير للقسم.',
        path: 'manufacture.title',
      }),
      'manufacture',
    ),
    inGroup(
      text({
        name: 'manufactureHeadline',
        en: 'What we manufacture: statement',
        ar: 'ماذا نصنع: الجملة الكبيرة',
        help: 'The big sentence of the section.',
        helpAr: 'الجملة الكبيرة للقسم.',
        path: 'manufacture.headline',
      }),
      'manufacture',
    ),
    inGroup(
      text({
        name: 'manufactureIntro',
        en: 'What we manufacture: intro',
        ar: 'ماذا نصنع: جملة تمهيدية',
        help: 'The sentence under the statement.',
        helpAr: 'الجملة تحت الجملة الكبيرة.',
        path: 'manufacture.intro',
        long: true,
      }),
      'manufacture',
    ),
  ],
  preview: {prepare: () => ({title: 'Home page / الصفحة الرئيسية'})},
})

// ---------------------------------------------------------------------------------------------
// Products and applications (lists)
// ---------------------------------------------------------------------------------------------
export const product = defineType({
  name: 'product',
  title: 'Product / منتج',
  type: 'document',
  fields: [
    orderRankField({type: 'product'}),
    text({
      name: 'name',
      en: 'Product name',
      ar: 'اسم المنتج',
      help: 'Shown on the card. Keep it short.',
      helpAr: 'بيظهر على الكارت. خليه قصير.',
      path: 'products.items.*.name',
    }),
    text({
      name: 'description',
      en: 'Description',
      ar: 'الوصف',
      help: 'One or two sentences about the fabric.',
      helpAr: 'جملة أو اتنين عن القماش.',
      path: 'products.items.*.description',
      long: true,
    }),
    picture({
      name: 'image',
      en: 'Product image',
      ar: 'صورة المنتج',
      help: 'Landscape photo (5:4 works best). The picture description is taken from the product name.',
      helpAr: 'صورة عرضية (نسبة 5:4 أفضل). وصف الصورة بيتاخد من اسم المنتج.',
    }),
    defineField({
      name: 'visible',
      title: 'Visible on the site / ظاهر في الموقع',
      description:
        'Turn off to hide the product without deleting it.  —  أطفيه لإخفاء المنتج من غير حذف.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({name: 'slug', title: 'Internal key', type: 'string', hidden: true, readOnly: true}),
  ],
  preview: {
    select: {title: 'name.en', subtitle: 'name.ar', media: 'image', visible: 'visible'},
    prepare: ({title, subtitle, media, visible}) => ({
      title,
      subtitle: `${subtitle ?? ''}${visible === false ? '  (hidden / مخفي)' : ''}`,
      media,
    }),
  },
})

export const manufactureItem = defineType({
  name: 'manufactureItem',
  title: 'Application / ماذا نصنع',
  type: 'document',
  fields: [
    orderRankField({type: 'manufactureItem'}),
    text({
      name: 'title',
      en: 'Title',
      ar: 'العنوان',
      help: 'Shown on the card.',
      helpAr: 'بيظهر على الكارت.',
      path: 'manufacture.items.*.title',
    }),
    text({
      name: 'description',
      en: 'Description',
      ar: 'الوصف',
      help: 'One sentence.',
      helpAr: 'جملة واحدة.',
      path: 'manufacture.items.*.description',
      long: true,
    }),
    picture({
      name: 'image',
      en: 'Image',
      ar: 'الصورة',
      help: 'The photo of the card.',
      helpAr: 'صورة الكارت.',
    }),
    defineField({name: 'slug', title: 'Internal key', type: 'string', hidden: true, readOnly: true}),
  ],
  preview: {select: {title: 'title.en', subtitle: 'title.ar', media: 'image'}},
})

// ---------------------------------------------------------------------------------------------
// About page (one document)
// ---------------------------------------------------------------------------------------------
const aboutText = (
  name: string,
  enLabel: string,
  arLabel: string,
  help: string,
  helpAr: string,
  path: string,
  long = true,
) => text({name, en: enLabel, ar: arLabel, help, helpAr, path, long})

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About page / صفحة من نحن',
  type: 'document',
  groups: [
    {name: 'intro', title: 'Top / أول الصفحة', default: true},
    {name: 'story', title: 'Story / القصة'},
    {name: 'quality', title: 'Quality / الجودة'},
    {name: 'vision', title: 'Vision & mission / الرؤية والرسالة'},
  ],
  fields: [
    inGroup(aboutText('title', 'Page title', 'عنوان الصفحة', 'The big heading.', 'العنوان الكبير.', 'about.title', false), 'intro'),
    inGroup(aboutText('lead', 'Opening sentence', 'الجملة الافتتاحية', 'The large sentence next to the title.', 'الجملة الكبيرة جنب العنوان.', 'about.paragraphs.0'), 'intro'),
    inGroup(picture({name: 'introImage', en: 'Wide top image', ar: 'الصورة العريضة', help: 'The wide photo under the title.', helpAr: 'الصورة العريضة تحت العنوان.'}), 'intro'),
    inGroup(
      fixedList({
        name: 'highlights',
        en: 'Four highlight items',
        ar: 'أربع نقاط مميزة',
        help: 'The four short phrases in the strip.',
        helpAr: 'الأربع عبارات القصيرة في الشريط.',
        count: en.footer.highlights.length,
        of: defineArrayMember({type: 'localeString'}),
      }),
      'intro',
    ),
    inGroup(aboutText('story1', 'Story paragraph 1', 'فقرة القصة 1', 'First paragraph next to the image.', 'أول فقرة جنب الصورة.', 'about.paragraphs.1'), 'story'),
    inGroup(aboutText('story2', 'Story paragraph 2', 'فقرة القصة 2', 'Second paragraph.', 'الفقرة التانية.', 'about.paragraphs.2'), 'story'),
    inGroup(aboutText('story3', 'Story paragraph 3', 'فقرة القصة 3', 'Third paragraph.', 'الفقرة التالتة.', 'about.paragraphs.5'), 'story'),
    inGroup(picture({name: 'storyImage', en: 'Story image', ar: 'صورة القصة', help: 'The portrait photo next to the story.', helpAr: 'الصورة الطولية جنب القصة.'}), 'story'),
    inGroup(aboutText('partnership', 'Partnership text (small)', 'نص الشراكة (الصغير)', 'The small paragraph above the big quote.', 'الفقرة الصغيرة فوق الجملة الكبيرة.', 'about.paragraphs.3'), 'story'),
    inGroup(aboutText('quote', 'Big quote', 'الجملة الكبيرة', 'The large sentence on the green band.', 'الجملة الكبيرة على الشريط الأخضر.', 'about.paragraphs.4'), 'story'),
    inGroup(plain({name: 'isoLabel', en: 'ISO label', ar: 'كلمة ISO', help: 'The large text on the dark band, e.g. ISO 9001.', helpAr: 'النص الكبير على الشريط الغامق، مثلاً ISO 9001.'}), 'quality'),
    inGroup(aboutText('isoText', 'ISO sentence', 'جملة الأيزو', 'The sentence next to the ISO label.', 'الجملة جنب كلمة الأيزو.', 'about.paragraphs.6'), 'quality'),
    inGroup(aboutText('visionTitle', 'Vision label', 'عنوان الرؤية', 'Small heading.', 'عنوان صغير.', 'vision.title', false), 'vision'),
    inGroup(aboutText('visionHeadline', 'Vision statement', 'جملة الرؤية', 'The large sentence.', 'الجملة الكبيرة.', 'vision.headline'), 'vision'),
    inGroup(aboutText('visionBody1', 'Vision paragraph 1', 'الرؤية: الفقرة 1', 'First paragraph.', 'الفقرة الأولى.', 'vision.body.0'), 'vision'),
    inGroup(aboutText('visionBody2', 'Vision paragraph 2', 'الرؤية: الفقرة 2', 'Second paragraph.', 'الفقرة التانية.', 'vision.body.1'), 'vision'),
    inGroup(aboutText('missionTitle', 'Mission label', 'عنوان الرسالة', 'Small heading.', 'عنوان صغير.', 'mission.title', false), 'vision'),
    inGroup(aboutText('missionHeadline', 'Mission statement', 'جملة الرسالة', 'The large sentence.', 'الجملة الكبيرة.', 'mission.headline'), 'vision'),
    inGroup(aboutText('missionBody1', 'Mission paragraph', 'الرسالة: الفقرة', 'The paragraph.', 'الفقرة.', 'mission.body.0'), 'vision'),
    inGroup(picture({name: 'visionImage', en: 'Vision & mission image', ar: 'صورة الرؤية والرسالة', help: 'The photo beside the green text.', helpAr: 'الصورة جنب النص الأخضر.'}), 'vision'),
  ],
  preview: {prepare: () => ({title: 'About page / صفحة من نحن'})},
})

// ---------------------------------------------------------------------------------------------
// Contact page (one document)
// ---------------------------------------------------------------------------------------------
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page / صفحة تواصل معنا',
  type: 'document',
  fields: [
    aboutText('title', 'Small heading', 'العنوان الصغير', 'Above the big sentence.', 'فوق الجملة الكبيرة.', 'contact.title', false),
    aboutText('headline', 'Big sentence', 'الجملة الكبيرة', 'The large heading.', 'العنوان الكبير.', 'contact.headline'),
    aboutText('intro', 'Intro', 'جملة تمهيدية', 'The paragraph under the heading.', 'الفقرة تحت العنوان.', 'contact.intro'),
    aboutText('phoneLabel', 'Phone label', 'كلمة تليفون', 'The word before the phone number.', 'الكلمة قبل رقم التليفون.', 'contact.phone.label', false),
    aboutText('whatsappLabel', 'WhatsApp label', 'كلمة واتساب', 'The word before the WhatsApp number.', 'الكلمة قبل رقم الواتساب.', 'contact.whatsapp.label', false),
    aboutText('locationLabel', 'Address label', 'كلمة العنوان', 'The word before the address.', 'الكلمة قبل العنوان.', 'contact.location.label', false),
    aboutText('emailLabel', 'Email label', 'كلمة البريد', 'The word before the email.', 'الكلمة قبل البريد.', 'contact.email.label', false),
    aboutText('instagramLabel', 'Instagram label', 'كلمة انستجرام', 'The word before the Instagram name.', 'الكلمة قبل اسم الانستجرام.', 'contact.instagram.label', false),
    aboutText('facebookLabel', 'Facebook label', 'كلمة فيسبوك', 'The word before the Facebook name.', 'الكلمة قبل اسم الفيسبوك.', 'contact.facebook.label', false),
    aboutText('inquiriesLabel', 'Business inquiries heading', 'عنوان الاستفسارات', 'The heading of the last block.', 'عنوان آخر جزء.', 'contact.inquiries.label', false),
    aboutText('inquiriesText', 'Business inquiries text', 'نص الاستفسارات', 'The sentence under that heading.', 'الجملة تحت العنوان.', 'contact.inquiries.text'),
    picture({name: 'image', en: 'Contact image', ar: 'صورة التواصل', help: 'The large photo beside the details.', helpAr: 'الصورة الكبيرة جنب البيانات.'}),
  ],
  preview: {prepare: () => ({title: 'Contact page / صفحة تواصل معنا'})},
})

// ---------------------------------------------------------------------------------------------
// Interface labels (one document)
// ---------------------------------------------------------------------------------------------
export const interfaceLabels = defineType({
  name: 'interfaceLabels',
  title: 'Interface labels / كلمات الواجهة',
  type: 'document',
  fields: [
    aboutText('navHome', 'Menu: Home', 'القائمة: الرئيسية', 'The Home link in the top menu.', 'رابط الرئيسية في القائمة.', 'nav.0.label', false),
    aboutText('navAbout', 'Menu: About', 'القائمة: من نحن', 'The About link.', 'رابط من نحن.', 'nav.1.label', false),
    aboutText('navContact', 'Menu: Contact', 'القائمة: تواصل معنا', 'The Contact link.', 'رابط تواصل معنا.', 'nav.2.label', false),
    aboutText('languageSwitch', 'Language button', 'زرار اللغة', 'What the button shows: on the English site (English box) and on the Arabic site (Arabic box).', 'اللي بيظهر على الزرار: في الموقع الإنجليزي (خانة English) وفي الموقع العربي (خانة العربية).', 'ui.languageSwitch.label', false),
    aboutText('menuOpen', 'Menu button (open)', 'زرار القائمة', 'Read aloud by screen readers.', 'بتتقري لقارئات الشاشة.', 'ui.menuOpen', false),
    aboutText('menuClose', 'Menu button (close)', 'زرار الإغلاق', 'Read aloud by screen readers.', 'بتتقري لقارئات الشاشة.', 'ui.menuClose', false),
    aboutText('skipToContent', 'Skip link', 'رابط تخطي', 'For keyboard users.', 'لمستخدمي الكيبورد.', 'ui.skipToContent', false),
    aboutText('notFound', 'Page not found', 'الصفحة غير موجودة', 'The heading of the 404 page.', 'عنوان صفحة الخطأ.', 'ui.notFound', false),
    aboutText('carouselPause', 'Pause button', 'زرار الإيقاف', 'For the products carousel.', 'لكروت المنتجات المتحركة.', 'ui.carouselPause', false),
    aboutText('carouselPlay', 'Play button', 'زرار التشغيل', 'For the products carousel.', 'لكروت المنتجات المتحركة.', 'ui.carouselPlay', false),
  ],
  preview: {prepare: () => ({title: 'Interface labels / كلمات الواجهة'})},
})
