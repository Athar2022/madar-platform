import {
  STAGE_OPTIONS,
  getGradesForStage,
  isValidGradeForStage,
} from '../utils/education.js'
import { CONTENT_STATUS, isPublished } from '../models/curriculum/contentStatus.js'
import { isValidSubject } from '../models/curriculum/subject.model.js'
import { isValidUnit } from '../models/curriculum/unit.model.js'
import { isValidLesson } from '../models/curriculum/lesson.model.js'
import { LESSONS, SUBJECTS, UNITS } from '../data/curriculum/index.js'

/**
 * @typedef {import('../models/curriculum/lesson.model.js').LessonModel} CurriculumLesson
 * @typedef {import('../models/curriculum/unit.model.js').UnitModel & { lessons: CurriculumLesson[] }} CurriculumUnit
 * @typedef {import('../models/curriculum/subject.model.js').SubjectModel & { units: CurriculumUnit[] }} CurriculumSubject
 */

/**
 * @typedef {Object} GradeCurriculum
 * @property {string} stage
 * @property {number} grade
 * @property {CurriculumSubject[]} subjects
 */

function compareByOrder(a, b) {
  return Number(a.order ?? 0) - Number(b.order ?? 0)
}

/**
 * Groups published lessons by unitId.
 * Only lessons that are valid, published, AND whose unitId is in the
 * provided `publishedUnitIds` set are included (referential integrity guard).
 *
 * @param {import('../models/curriculum/lesson.model.js').LessonModel[]} lessons
 * @param {Set<string>} publishedUnitIds - IDs of valid, published units
 * @returns {Map<string, CurriculumLesson[]>}
 */
function groupPublishedLessonsByUnitId(lessons, publishedUnitIds) {
  /** @type {Map<string, CurriculumLesson[]>} */
  const lessonsByUnit = new Map()

  for (const lesson of lessons) {
    // Guard 1: lesson itself must be valid and published
    if (!isValidLesson(lesson) || !isPublished(lesson)) continue
    // Guard 2: lesson must reference a known, published unit (referential integrity)
    if (!publishedUnitIds.has(lesson.unitId)) continue

    const list = lessonsByUnit.get(lesson.unitId)
    if (list) {
      list.push({ ...lesson })
    } else {
      lessonsByUnit.set(lesson.unitId, [{ ...lesson }])
    }
  }

  for (const list of lessonsByUnit.values()) {
    list.sort(compareByOrder)
  }

  return lessonsByUnit
}

/**
 * Groups published units by subjectId.
 * Only units that are valid, published, AND whose subjectId is in the
 * provided `publishedSubjectIds` set are included (referential integrity guard).
 *
 * @param {import('../models/curriculum/unit.model.js').UnitModel[]} units
 * @param {Map<string, CurriculumLesson[]>} lessonsByUnit
 * @param {Set<string>} publishedSubjectIds - IDs of valid, published subjects
 * @returns {Map<string, CurriculumUnit[]>}
 */
function groupPublishedUnitsBySubjectId(units, lessonsByUnit, publishedSubjectIds) {
  /** @type {Map<string, CurriculumUnit[]>} */
  const unitsBySubject = new Map()

  for (const unit of units) {
    // Guard 1: unit itself must be valid and published
    if (!isValidUnit(unit) || !isPublished(unit)) continue
    // Guard 2: unit must reference a known, published subject (referential integrity)
    if (!publishedSubjectIds.has(unit.subjectId)) continue

    const hydratedUnit = {
      ...unit,
      lessons: lessonsByUnit.get(unit.id) ?? [],
    }
    const list = unitsBySubject.get(unit.subjectId)
    if (list) {
      list.push(hydratedUnit)
    } else {
      unitsBySubject.set(unit.subjectId, [hydratedUnit])
    }
  }

  for (const list of unitsBySubject.values()) {
    list.sort(compareByOrder)
  }

  return unitsBySubject
}

/**
 * Builds a grade-indexed student curriculum map from normalized entity lists.
 * Only published subjects, units, and lessons are included, ordered by `order`.
 *
 * @param {Object} [source]
 * @param {import('../models/curriculum/subject.model.js').SubjectModel[]} [source.subjects]
 * @param {import('../models/curriculum/unit.model.js').UnitModel[]} [source.units]
 * @param {import('../models/curriculum/lesson.model.js').LessonModel[]} [source.lessons]
 * @returns {Record<number, GradeCurriculum>}
 */
export function buildCurriculumByGrade({
  subjects = SUBJECTS,
  units = UNITS,
  lessons = LESSONS,
} = {}) {
  // ── Pass 1: collect IDs of valid, published subjects ──────────────────────
  const publishedSubjectIds = new Set(
    subjects
      .filter((s) => isValidSubject(s) && isPublished(s))
      .map((s) => s.id),
  )

  // ── Pass 2: collect IDs of valid, published units whose subject exists ────
  //    Units referencing a nonexistent or unpublished subject are dropped here.
  const publishedUnitIds = new Set(
    units
      .filter(
        (u) =>
          isValidUnit(u) &&
          isPublished(u) &&
          publishedSubjectIds.has(u.subjectId),
      )
      .map((u) => u.id),
  )

  // ── Pass 3: build lookup maps using the validated ID sets ─────────────────
  //    Lessons referencing a nonexistent or unpublished unit are dropped.
  const lessonsByUnit = groupPublishedLessonsByUnitId(lessons, publishedUnitIds)
  const unitsBySubject = groupPublishedUnitsBySubjectId(
    units,
    lessonsByUnit,
    publishedSubjectIds,
  )

  /** @type {Record<number, GradeCurriculum>} */
  const index = {}

  for (const { value: stage } of STAGE_OPTIONS) {
    for (const gradeItem of getGradesForStage(stage)) {
      index[gradeItem.value] = {
        stage,
        grade: gradeItem.value,
        subjects: [],
      }
    }
  }

  for (const subject of subjects) {
    if (!isValidSubject(subject) || !isPublished(subject)) continue
    const numericGrade = Number(subject.grade)
    const gradeBucket = index[numericGrade]
    if (!gradeBucket || !isValidGradeForStage(gradeBucket.stage, numericGrade)) {
      continue
    }

    gradeBucket.subjects.push({
      ...subject,
      grade: numericGrade,
      units: unitsBySubject.get(subject.id) ?? [],
    })
  }

  for (const gradeBucket of Object.values(index)) {
    gradeBucket.subjects.sort(compareByOrder)
  }

  return index
}

/**
 * Grade-indexed published curriculum built from the central data source.
 *
 * @type {Record<number, GradeCurriculum>}
 */
export const CURRICULUM_BY_GRADE = buildCurriculumByGrade()

/**
 * Returns the curriculum container for a specific stage and grade.
 *
 * @param {string} stage
 * @param {number | string} grade
 * @param {Record<number, GradeCurriculum>} [curriculumByGrade]
 * @returns {GradeCurriculum}
 */
export function getCurriculumForGrade(
  stage,
  grade,
  curriculumByGrade = CURRICULUM_BY_GRADE,
) {
  const numericGrade = Number(grade)
  if (!isValidGradeForStage(stage, numericGrade)) {
    return {
      stage,
      grade: numericGrade,
      subjects: [],
    }
  }

  return (
    curriculumByGrade[numericGrade] ?? {
      stage,
      grade: numericGrade,
      subjects: [],
    }
  )
}

/**
 * Returns published subjects registered specifically for the student's grade.
 *
 * @param {string} stage
 * @param {number | string} grade
 * @param {Record<number, GradeCurriculum>} [curriculumByGrade]
 * @returns {CurriculumSubject[]}
 */
export function getSubjectsForGrade(
  stage,
  grade,
  curriculumByGrade = CURRICULUM_BY_GRADE,
) {
  return getCurriculumForGrade(stage, grade, curriculumByGrade).subjects
}

/**
 * Computes published unit and lesson totals for a subject entry.
 * Unpublished units and lessons are never counted.
 *
 * @param {CurriculumSubject | null | undefined} subject
 * @returns {{ unitsCount: number, lessonsCount: number }}
 */
export function countSubjectUnitsAndLessons(subject) {
  const rawUnits = Array.isArray(subject?.units) ? subject.units : []
  const publishedUnits = rawUnits.filter((unit) => isPublished(unit))

  const lessonsCount = publishedUnits.reduce((total, unit) => {
    const rawLessons = Array.isArray(unit?.lessons) ? unit.lessons : []
    const publishedLessons = rawLessons.filter((lesson) => isPublished(lesson))
    return total + publishedLessons.length
  }, 0)

  return {
    unitsCount: publishedUnits.length,
    lessonsCount,
  }
}

export { CONTENT_STATUS }
