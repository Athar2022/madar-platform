export const EDUCATION_STAGES = {
  primary: {
    value: 'primary',
    label: 'المرحلة الابتدائية',
    shortLabel: 'ابتدائي',
  },
  secondary: {
    value: 'secondary',
    label: 'المرحلة الثانوية',
    shortLabel: 'ثانوي',
  },
}

export const STAGE_OPTIONS = [
  EDUCATION_STAGES.primary,
  EDUCATION_STAGES.secondary,
]

export const GRADES_BY_STAGE = {
  primary: [
    { value: 1, label: 'الصف الأول' },
    { value: 2, label: 'الصف الثاني' },
    { value: 3, label: 'الصف الثالث' },
    { value: 4, label: 'الصف الرابع' },
    { value: 5, label: 'الصف الخامس' },
    { value: 6, label: 'الصف السادس' },
    { value: 7, label: 'الصف السابع' },
    { value: 8, label: 'الصف الثامن' },
    { value: 9, label: 'الصف التاسع' },
  ],
  secondary: [
    { value: 10, label: 'الصف الأول الثانوي' },
    { value: 11, label: 'الصف الثاني الثانوي' },
    { value: 12, label: 'الصف الثالث الثانوي' },
  ],
}

export function getGradesForStage(stage) {
  return GRADES_BY_STAGE[stage] ?? []
}

export function getStageLabel(stage) {
  return EDUCATION_STAGES[stage]?.label ?? ''
}

export function getGradeLabel(stage, grade) {
  const numericGrade = Number(grade)
  const found = getGradesForStage(stage).find((item) => item.value === numericGrade)
  return found?.label ?? `الصف ${numericGrade}`
}

export function isValidGradeForStage(stage, grade) {
  const numericGrade = Number(grade)
  return getGradesForStage(stage).some((item) => item.value === numericGrade)
}

/**
 * Extracts 1-2 representative initials from an Arabic or Latin student name.
 */
export function getStudentInitials(fullName = '') {
  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'ط'
  if (words.length === 1) {
    const chars = [...words[0]]
    return chars[0] ?? 'ط'
  }
  const firstChar = [...words[0]][0] ?? ''
  const lastChar = [...words[words.length - 1]][0] ?? ''
  return `${firstChar} ${lastChar}`.trim()
}

const AVATAR_TONES = [
  {
    bg: 'rgba(59, 130, 246, 0.16)',
    border: 'rgba(59, 130, 246, 0.42)',
    text: '#70C7F5',
  },
  {
    bg: 'rgba(112, 199, 245, 0.14)',
    border: 'rgba(112, 199, 245, 0.38)',
    text: '#93D9FA',
  },
  {
    bg: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.38)',
    text: '#7DD3FC',
  },
  {
    bg: 'rgba(99, 102, 241, 0.18)',
    border: 'rgba(129, 140, 248, 0.4)',
    text: '#A5B4FC',
  },
  {
    bg: 'rgba(20, 184, 166, 0.16)',
    border: 'rgba(45, 212, 191, 0.38)',
    text: '#5EEAD4',
  },
]

/**
 * Returns a deterministic visual tone for a student's avatar.
 */
export function getAvatarTone(seed = '') {
  const str = String(seed)
  let hash = 0
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length]
}
