/**
 * Central curriculum data repository for MADAR.
 *
 * Entities are stored independently and linked via IDs:
 * Grade (1-12 via education.js) -> Subject (grade) -> Unit (subjectId) -> Lesson (unitId).
 *
 * Intentionally empty until verified Yemeni curriculum data is added.
 */

/**
 * @type {import('@/models/curriculum/subject.model').SubjectModel[]}
 */
export const SUBJECTS = []

/**
 * @type {import('@/models/curriculum/unit.model').UnitModel[]}
 */
export const UNITS = []

/**
 * @type {import('@/models/curriculum/lesson.model').LessonModel[]}
 */
export const LESSONS = []
