import { ar } from './ar'
import { en } from './en'
import type { Content, Lang } from './types'

export const content: Record<Lang, Content> = { en, ar }
export const LANGS: Lang[] = ['en', 'ar']
export const DEFAULT_LANG: Lang = 'en'
export const isLang = (value: string | undefined): value is Lang => value === 'en' || value === 'ar'
export type { Content, Lang, Link, LinkTarget, RouteKey } from './types'
