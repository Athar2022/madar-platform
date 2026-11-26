/**
 * Central content lifecycle statuses for MADAR curriculum entities.
 */
export const CONTENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
})

/**
 * @typedef {'draft' | 'published' | 'archived'} ContentStatus
 */

const VALID_STATUS_SET = new Set(Object.values(CONTENT_STATUS))

/**
 * Checks whether a value is a supported content lifecycle status.
 * @param {unknown} status
 * @returns {status is ContentStatus}
 */
export function isValidContentStatus(status) {
  return typeof status === 'string' && VALID_STATUS_SET.has(status)
}

/**
 * Checks whether a curriculum entity is published for student consumption.
 * @param {{ status?: unknown } | null | undefined} entity
 * @returns {boolean}
 */
export function isPublished(entity) {
  return entity?.status === CONTENT_STATUS.PUBLISHED
}
