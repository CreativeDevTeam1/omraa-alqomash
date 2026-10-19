import {defineConfig} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {schemaTypes} from './schemaTypes'
import {Logo} from './components/Logo'

/** Documents that exist exactly once (edited from a fixed place in the sidebar). */
const SINGLETONS = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'contactPage',
  'interfaceLabels',
])

const singleton = (S: StructureBuilder, id: string, title: string) =>
  S.listItem()
    .id(id)
    .title(title)
    .child(S.document().schemaType(id).documentId(id).title(title))

export default defineConfig({
  name: 'default',
  title: 'Omraa Al Qomash — أمراء القماش',

  projectId: 'f4el6clm',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content / المحتوى')
          .items([
            singleton(S, 'siteSettings', 'Site settings (contact, footer) / إعدادات الموقع'),
            S.divider(),
            singleton(S, 'homePage', 'Home page (hero, videos, texts) / الصفحة الرئيسية'),
            orderableDocumentListDeskItem({
              type: 'product',
              title: 'Products (drag to reorder) / المنتجات (اسحب للترتيب)',
              S,
              context,
            }),
            orderableDocumentListDeskItem({
              type: 'manufactureItem',
              title: 'What we manufacture (6) / ماذا نصنع',
              S,
              context,
            }),
            S.divider(),
            singleton(S, 'aboutPage', 'About page / صفحة من نحن'),
            singleton(S, 'contactPage', 'Contact page / صفحة تواصل معنا'),
            singleton(S, 'interfaceLabels', 'Interface labels / كلمات الواجهة'),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "new document" menu.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.has(schemaType)),
  },

  document: {
    // Singletons cannot be deleted or duplicated.
    actions: (input, {schemaType}) =>
      SINGLETONS.has(schemaType)
        ? input.filter(({action}) => action && !['delete', 'duplicate', 'unpublish'].includes(action))
        : input,
  },

  studio: {components: {logo: Logo}},
})
