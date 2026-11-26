import { CONTENT_STATUS, isValidContentStatus } from './contentStatus.js'

/**
 * @typedef {import('./contentStatus.js').ContentStatus} ContentStatus
 */

/**
 * @typedef {Object} LessonModel
 * @property {string} id - Unique lesson identifier.
 * @property {string} unitId - Foreign key referencing UnitModel.id.
 * @property {string} title - Lesson title in Arabic.
 * @property {string} [description] - Optional short description of the lesson.
 * @property {number} order - Display order within the parent unit.
 * @property {ContentStatus} status - Content lifecycle status.
 */

/**
 * Creates a normalized Lesson entity.
 * @param {Partial<LessonModel> & { id: string, unitId: string, title: string }} input
 * @returns {LessonModel}
 */
export function createLesson(input) {
  return {
    id: String(input.id).trim(),
    unitId: String(input.unitId).trim(),
    title: String(input.title).trim(),
    ...(input.description ? { description: String(input.description).trim() } : {}),
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : 0,
    status: isValidContentStatus(input.status) ? input.status : CONTENT_STATUS.DRAFT,
  }
}

/**
 * Validates that a lesson record has required structural fields.
 * @param {unknown} lesson
 * @returns {lesson is LessonModel}
 */
export function isValidLesson(lesson) {
  if (!lesson || typeof lesson !== 'object') return false
  return (
    typeof lesson.id === 'string' &&
    lesson.id.trim().length > 0 &&
    typeof lesson.unitId === 'string' &&
    lesson.unitId.trim().length > 0 &&
    typeof lesson.title === 'string' &&
    lesson.title.trim().length > 0 &&
    Number.isFinite(Number(lesson.order)) &&
    isValidContentStatus(lesson.status)
  )
}
