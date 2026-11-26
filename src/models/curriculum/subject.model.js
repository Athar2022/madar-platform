import { CONTENT_STATUS, isValidContentStatus } from './contentStatus.js'

/**
 * @typedef {import('./contentStatus.js').ContentStatus} ContentStatus
 */

/**
 * @typedef {Object} SubjectModel
 * @property {string} id - Unique subject identifier.
 * @property {number} grade - Numeric grade level (1-12).
 * @property {string} name - Subject display name in Arabic.
 * @property {string} [description] - Optional short description of the subject.
 * @property {number} order - Display order within the grade.
 * @property {ContentStatus} status - Content lifecycle status.
 */

/**
 * Creates a normalized Subject entity.
 * @param {Partial<SubjectModel> & { id: string, grade: number, name: string }} input
 * @returns {SubjectModel}
 */
export function createSubject(input) {
  return {
    id: String(input.id).trim(),
    grade: Number(input.grade),
    name: String(input.name).trim(),
    ...(input.description ? { description: String(input.description).trim() } : {}),
    order: Number.isFinite(Number(input.order)) ? Number(input.order) : 0,
    status: isValidContentStatus(input.status) ? input.status : CONTENT_STATUS.DRAFT,
  }
}

/**
 * Validates that a subject record has required structural fields.
 * @param {unknown} subject
 * @returns {subject is SubjectModel}
 */
export function isValidSubject(subject) {
  if (!subject || typeof subject !== 'object') return false
  const gradeValue = subject.grade
  if (
    (typeof gradeValue !== 'number' && typeof gradeValue !== 'string') ||
    (typeof gradeValue === 'string' && gradeValue.trim().length === 0)
  ) {
    return false
  }
  const grade = Number(gradeValue)

  return (
    typeof subject.id === 'string' &&
    subject.id.trim().length > 0 &&
    Number.isInteger(grade) &&
    grade >= 1 &&
    grade <= 12 &&
    typeof subject.name === 'string' &&
    subject.name.trim().length > 0 &&
    Number.isFinite(Number(subject.order)) &&
    isValidContentStatus(subject.status)
  )
}
