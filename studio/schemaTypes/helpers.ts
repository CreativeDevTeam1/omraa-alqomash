import {defineField, defineType, type ValidationContext} from 'sanity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rule = any
import {RtlInput} from '../components/RtlInput'
import {BilingualInput} from '../components/BilingualInput'
import {limitsFor} from '../lib/limits'

/** Bilingual text: an object { en, ar }, both required, shown side by side, Arabic right-to-left. */
const bilingual = (name: 'localeString' | 'localeText', title: string, multiline: boolean) =>
  defineType({
    name,
    title,
    type: 'object',
    components: {input: BilingualInput},
    fields: [
      defineField({
        name: 'en',
        title: 'English',
        type: multiline ? 'text' : 'string',
        rows: multiline ? 4 : undefined,
        validation: (rule: Rule) => rule.required().error('English text is required'),
      }),
      defineField({
        name: 'ar',
        title: 'العربية',
        type: multiline ? 'text' : 'string',
        rows: multiline ? 4 : undefined,
        components: {input: RtlInput},
        validation: (rule: Rule) => rule.required().error('النص العربي مطلوب'),
      }),
    ],
    options: {columns: 2} as never,
  })

export const localeString = bilingual('localeString', 'Text (EN / AR)', false)
export const localeText = bilingual('localeText', 'Long text (EN / AR)', true)

interface TextOpts {
  name: string
  /** Label: English / Arabic. */
  en: string
  ar: string
  /** Short helper for a non-technical person: English / Arabic. */
  help: string
  helpAr: string
  /** Path into the current site content: sets the "too long" warning (longest text + 30%). */
  path?: string
  long?: boolean
}

/** A bilingual text field with a bilingual label and helper, and a length warning. */
export const text = (o: TextOpts) =>
  defineField({
    name: o.name,
    title: `${o.en} / ${o.ar}`,
    description: `${o.help}  —  ${o.helpAr}`,
    type: o.long ? 'localeText' : 'localeString',
    validation: (rule: Rule) => {
      const {maxEn, maxAr} = o.path ? limitsFor(o.path) : {maxEn: undefined, maxAr: undefined}
      return [
        rule.required(),
        rule
          .custom((value: {en?: string; ar?: string} | undefined) => {
            if (!value) return true
            if (maxEn && value.en && value.en.length > maxEn)
              return `English text is long (${value.en.length} characters; keep it under ${maxEn}) so it may break the design / النص الإنجليزي طويل`
            if (maxAr && value.ar && value.ar.length > maxAr)
              return `Arabic text is long (${value.ar.length}; keep it under ${maxAr}) so it may break the design / النص العربي طويل أكتر من اللازم (${maxAr} حرف)`
            return true
          })
          .warning(),
      ]
    },
  })

/** A plain (not translated) text field such as a phone number or a URL. */
export const plain = (o: {
  name: string
  en: string
  ar: string
  help: string
  helpAr: string
  required?: boolean
  rule?: (rule: Rule) => Rule
}) =>
  defineField({
    name: o.name,
    title: `${o.en} / ${o.ar}`,
    description: `${o.help}  —  ${o.helpAr}`,
    type: 'string',
    validation: (rule: Rule) => {
      let r = o.required === false ? rule : rule.required()
      if (o.rule) r = o.rule(r)
      return r
    },
  })

const MIN_IMAGE_WIDTH = 1600

/** An image with crop/hotspot, and a warning when it is under 1600px wide. */
export const picture = (o: {
  name: string
  en: string
  ar: string
  help: string
  helpAr: string
  required?: boolean
}) =>
  defineField({
    name: o.name,
    title: `${o.en} / ${o.ar}`,
    description: `${o.help}  —  ${o.helpAr}  (≥ ${MIN_IMAGE_WIDTH}px wide / عرض ${MIN_IMAGE_WIDTH} بكسل على الأقل)`,
    type: 'image',
    options: {hotspot: true},
    validation: (rule: Rule) => [
      o.required === false ? rule : rule.required(),
      rule
        .custom(async (value: {asset?: {_ref?: string}} | undefined, context: ValidationContext) => {
          const ref = value?.asset?._ref
          if (!ref) return true
          const client = context.getClient({apiVersion: '2024-01-01'})
          const width = await client.fetch(
            '*[_id == $id][0].metadata.dimensions.width',
            {id: ref},
          )
          if (width && width < MIN_IMAGE_WIDTH)
            return `Low resolution (${width}px wide). Use at least ${MIN_IMAGE_WIDTH}px so it stays sharp. / الصورة صغيرة (${width} بكسل). استخدم ${MIN_IMAGE_WIDTH} بكسل على الأقل`
          return true
        })
        .warning(),
    ],
  })

const MAX_VIDEO_BYTES = 8 * 1024 * 1024

/** A video: MP4 only, up to 8 MB, with a required poster image. */
export const videoObject = defineType({
  name: 'siteVideo',
  title: 'Video + poster / فيديو + صورة غلاف',
  type: 'object',
  fields: [
    defineField({
      name: 'file',
      title: 'Video file (MP4) / ملف الفيديو',
      description:
        'MP4 only, up to 8 MB. Export: 1080p, H.264, NO audio, 10 seconds or less, 30 fps.  —  MP4 فقط، لحد 8 ميجا. التصدير: 1080p، H.264، من غير صوت، 10 ثواني أو أقل.',
      type: 'file',
      options: {accept: 'video/mp4'},
      validation: (rule: Rule) => [
        rule.required(),
        rule.custom(async (value: {asset?: {_ref?: string}} | undefined, context: ValidationContext) => {
          const ref = value?.asset?._ref
          if (!ref) return true
          const client = context.getClient({apiVersion: '2024-01-01'})
          const asset = await client.fetch(
            '*[_id == $id][0]{size, mimeType}',
            {id: ref},
          )
          if (asset?.mimeType && asset.mimeType !== 'video/mp4')
            return 'Only MP4 videos are allowed. / MP4 فقط'
          if (asset?.size && asset.size > MAX_VIDEO_BYTES)
            return `The video is ${(asset.size / 1048576).toFixed(1)} MB. The limit is 8 MB: export at 1080p, H.264, no audio, ≤ 10 s. / حجم الفيديو أكبر من 8 ميجا`
          return true
        }),
      ],
    }),
    defineField({
      name: 'poster',
      title: 'Poster image / صورة الغلاف',
      description:
        'A still frame shown while the video loads. Required.  —  صورة ثابتة بتظهر لحد ما الفيديو يشتغل. مطلوبة.',
      type: 'image',
      validation: (rule: Rule) => rule.required(),
    }),
  ],
})

export const videoField = (o: {
  name: string
  en: string
  ar: string
  help: string
  helpAr: string
}) =>
  defineField({
    name: o.name,
    title: `${o.en} / ${o.ar}`,
    description: `${o.help}  —  ${o.helpAr}`,
    type: 'siteVideo',
  })
