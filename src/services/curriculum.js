import { getGradesForStage, isValidGradeForStage } from '@/utils/education'

/**
 * @typedef {Object} CurriculumLesson
 * @property {string} id
 * @property {string} title
 * @property {number} order
 */

/**
 * @typedef {Object} CurriculumUnit
 * @property {string} id
 * @property {string} title
 * @property {number} order
 * @property {CurriculumLesson[]} lessons
 */

/**
 * @typedef {Object} CurriculumSubject
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {CurriculumUnit[]} units
 */

/**
 * @typedef {Object} GradeCurriculum
 * @property {string} stage
 * @property {number} grade
 * @property {CurriculumSubject[]} subjects
 */

function createEmptyCurriculumIndex() {
  const index = {}
  for (const stage of ['primary', 'secondary']) {
    for (const gradeItem of getGradesForStage(stage)) {
      index[gradeItem.value] = {
        stage,
        grade: gradeItem.value,
        subjects: [],
      }
    }
  }
  return index
}

/**
 * Maintainable grade-indexed curriculum registry.
 * Verified subjects, units, and lessons can be populated per grade (1-12)
 * without altering dashboard or component logic.
 *
 * @type {Record<number, GradeCurriculum>}
 */
export const CURRICULUM_BY_GRADE = createEmptyCurriculumIndex()

/**
 * Returns the curriculum container for a specific stage and grade.
 */
export function getCurriculumForGrade(stage, grade) {
  const numericGrade = Number(grade)
  if (!isValidGradeForStage(stage, numericGrade)) {
    return {
      stage,
      grade: numericGrade,
      subjects: [],
    }
  }

  return (
    CURRICULUM_BY_GRADE[numericGrade] ?? {
      stage,
      grade: numericGrade,
      subjects: [],
    }
  )
}

/**
 * Returns subjects registered specifically for the student's grade.
 */
export function getSubjectsForGrade(stage, grade) {
  return getCurriculumForGrade(stage, grade).subjects
}

/**
 * Computes unit and lesson totals for a subject entry.
 */
export function countSubjectUnitsAndLessons(subject) {
  const units = Array.isArray(subject?.units) ? subject.units : []
  const lessonsCount = units.reduce(
    (total, unit) => total + (Array.isArray(unit?.lessons) ? unit.lessons.length : 0),
    0,
  )
  return {
    unitsCount: units.length,
    lessonsCount,
  }
}
