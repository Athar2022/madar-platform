import { CONTENT_STATUS, isValidContentStatus } from './contentStatus.js'

/**
 * @typedef {import('./contentStatus.js').ContentStatus} ContentStatus
 */

/**
 * @typedef {Object} UnitModel
 * @property {string} id - Unique unit identifier.
 * @property {string} subjectId - Foreign key referencing SubjectModel.id.
 * @property {string} title - Unit title in Arabic.
 * @property {string} [description] - Optional short description of the unit.
 * @property {number} order - Display order within the parent subject.
 * @property {ContentStatus} status - Content lifecycle status.
 */

/**
 * Creates a normalized Unit entity.
 * @param {Partial<UnitModel> & { id: string, subjectId: string, title: string }} input
 * @returns {UnitModel}
 */
export function createUnit(input) {
  return {
    id: String(input.id).trim(),
    subjectId: String(input.subjectId).trim(),
    title: String(input.title).trim(),
    ...(input.description ? { description: String(input.description).trim() } : {}),
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : 0,
    status: isValidContentStatus(input.status) ? input.status : CONTENT_STATUS.DRAFT,
  }
}

/**
 * Validates that a unit record has required structural fields.
 * @param {unknown} unit
 * @returns {unit is UnitModel}
 */
export function isValidUnit(unit) {
  if (!unit || typeof unit !== 'object') return false
  return (
    typeof unit.id === 'string' &&
    unit.id.trim().length > 0 &&
    typeof unit.subjectId === 'string' &&
    unit.subjectId.trim().length > 0 &&
    typeof unit.title === 'string' &&
    unit.title.trim().length > 0 &&
    Number.isFinite(Number(unit.order)) &&
    isValidContentStatus(unit.status)
  )
}
