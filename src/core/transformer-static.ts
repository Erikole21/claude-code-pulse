import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import type { Root, Content } from 'mdast'

const JSX_TAG_RE = /^<\/?[A-Z][A-Za-z]*[\s/>]/
const INTERNAL_LINK_RE = /^\/docs\//

function isJsxNode(node: Content): boolean {
  if (node.type === 'html' && JSX_TAG_RE.test(node.value)) return true
  return false
}

function isImageNode(node: Content): boolean {
  return node.type === 'image'
}

function isInternalLink(node: Content): boolean {
  if (node.type === 'link' && INTERNAL_LINK_RE.test(node.url)) return true
  return false
}

function filterChildren(nodes: Content[]): Content[] {
  const result: Content[] = []

  for (const node of nodes) {
    if (isJsxNode(node) || isImageNode(node)) continue

    if (isInternalLink(node)) {
      // Keep the link text but remove the link wrapper
      if ('children' in node && node.children.length > 0) {
        result.push(...filterChildren(node.children as Content[]))
      }
      continue
    }

    // Recurse into nodes with children
    if ('children' in node && Array.isArray(node.children)) {
      const filtered = filterChildren(node.children as Content[])
      result.push({ ...node, children: filtered } as Content)
    } else {
      result.push(node)
    }
  }

  return result
}

function cleanAst() {
  return (tree: Root) => {
    tree.children = filterChildren(tree.children as Content[]) as Root['children']
  }
}

/**
 * Transform raw markdown by removing JSX, images, and internal links.
 * Truncates to tokenBudget at section boundaries.
 */
export function transformStatic(rawMarkdown: string, tokenBudget: number): string {
  const processor = unified()
    .use(remarkParse)
    .use(cleanAst)
    .use(remarkStringify, { bullet: '-', emphasis: '*', strong: '*' })

  const result = processor.processSync(rawMarkdown)
  const cleaned = String(result)

  const charBudget = tokenBudget * 4

  if (cleaned.length <= charBudget) {
    return cleaned
  }

  return truncateAtSectionBoundary(cleaned, charBudget)
}

function truncateAtSectionBoundary(text: string, charBudget: number): string {
  const lines = text.split('\n')
  let length = 0
  let lastHeadingIndex = 0

  for (let i = 0; i < lines.length; i++) {
    length += lines[i].length + 1 // +1 for newline

    if (/^#{1,3} /.test(lines[i])) {
      lastHeadingIndex = i
    }

    if (length > charBudget) {
      // Cut at the last heading boundary before budget exceeded
      const cutIndex = lastHeadingIndex > 0 ? lastHeadingIndex : i
      return lines.slice(0, cutIndex).join('\n').trim()
    }
  }

  return text
}
