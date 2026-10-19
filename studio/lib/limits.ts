import {ar} from '../../src/content/ar'
import {en} from '../../src/content/en'

type Tree = unknown

const walk = (node: Tree, keys: string[]): string[] => {
  if (node == null) return []
  if (keys.length === 0) return typeof node === 'string' ? [node] : []
  const [head, ...rest] = keys
  if (head === '*') {
    return Array.isArray(node) ? node.flatMap((child) => walk(child, rest)) : []
  }
  return walk((node as Record<string, Tree>)[head], rest)
}

/**
 * Character limits for a field: the longest text the site currently has at `path` + 30%.
 * `path` is a dotted path into the site content, `*` matches every item of a list
 * (e.g. `products.items.*.description`). Used for the "too long" warnings in the Studio.
 */
export const limitsFor = (path: string) => {
  const keys = path.split('.')
  const longest = (tree: Tree) => Math.max(0, ...walk(tree, keys).map((s) => s.length))
  return {
    maxEn: Math.ceil(longest(en) * 1.3) || undefined,
    maxAr: Math.ceil(longest(ar) * 1.3) || undefined,
  }
}
