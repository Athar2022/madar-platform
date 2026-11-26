import { computed, ref } from 'vue'
import { isValidGradeForStage } from '@/utils/education'

export const PROFILES_STORAGE_KEY = 'madar_student_profiles'
export const SELECTED_STUDENT_STORAGE_KEY = 'madar_selected_student_id'

function generateStudentId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `stu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function createSampleStudents() {
  const now = new Date().toISOString()
  return [
    {
      id: generateStudentId(),
      fullName: 'ليان أحمد السالم',
      stage: 'primary',
      grade: 5,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: generateStudentId(),
      fullName: 'عمر خالد المنصور',
      stage: 'secondary',
      grade: 10,
      createdAt: now,
      updatedAt: now,
    },
  ]
}

function normalizeStudentRecord(record) {
  if (!record || typeof record !== 'object') return null
  const id = typeof record.id === 'string' && record.id.trim() ? record.id.trim() : null
  const fullName = typeof record.fullName === 'string' ? record.fullName.trim() : ''
  const stage = record.stage === 'primary' || record.stage === 'secondary' ? record.stage : null
  const grade = Number(record.grade)

  if (!id || !fullName || !stage || !isValidGradeForStage(stage, grade)) {
    return null
  }

  return {
    id,
    fullName,
    stage,
    grade,
    createdAt: typeof record.createdAt === 'string' ? record.createdAt : new Date().toISOString(),
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
  }
}

function persistStudents(list) {
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(list))
  } catch {
    // Ignore storage quota / privacy-mode errors so UI stays functional in-memory
  }
}

function persistSelectedStudentId(id) {
  try {
    if (id) {
      localStorage.setItem(SELECTED_STUDENT_STORAGE_KEY, id)
    } else {
      localStorage.removeItem(SELECTED_STUDENT_STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors
  }
}

function loadInitialStudents() {
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY)
    // Seed sample profiles ONLY when no profiles key exists yet
    if (raw === null) {
      const samples = createSampleStudents()
      persistStudents(samples)
      return samples
    }

    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeStudentRecord).filter(Boolean)
    }
    return []
  } catch {
    return []
  }
}

function loadInitialSelectedId(validStudents) {
  try {
    const storedId = localStorage.getItem(SELECTED_STUDENT_STORAGE_KEY)
    if (!storedId) return null
    const exists = validStudents.some((student) => student.id === storedId)
    if (!exists) {
      persistSelectedStudentId(null)
      return null
    }
    return storedId
  } catch {
    return null
  }
}

const students = ref(loadInitialStudents())
const selectedStudentId = ref(loadInitialSelectedId(students.value))

export function useStudentAccounts() {
  const selectedStudent = computed(() => {
    if (!selectedStudentId.value) return null
    return students.value.find((student) => student.id === selectedStudentId.value) ?? null
  })

  function addStudent({ fullName, stage, grade }) {
    const now = new Date().toISOString()
    const newStudent = {
      id: generateStudentId(),
      fullName: fullName.trim(),
      stage,
      grade: Number(grade),
      createdAt: now,
      updatedAt: now,
    }
    students.value = [...students.value, newStudent]
    persistStudents(students.value)
    return newStudent
  }

  function updateStudent(id, { fullName, stage, grade }) {
    const now = new Date().toISOString()
    let updatedRecord = null
    students.value = students.value.map((student) => {
      if (student.id !== id) return student
      updatedRecord = {
        ...student,
        fullName: fullName.trim(),
        stage,
        grade: Number(grade),
        updatedAt: now,
      }
      return updatedRecord
    })
    persistStudents(students.value)
    return updatedRecord
  }

  function deleteStudent(id) {
    students.value = students.value.filter((student) => student.id !== id)
    persistStudents(students.value)
    if (selectedStudentId.value === id) {
      selectedStudentId.value = null
      persistSelectedStudentId(null)
    }
  }

  function selectStudent(id) {
    const exists = students.value.some((student) => student.id === id)
    if (!exists) return
    selectedStudentId.value = id
    persistSelectedStudentId(id)
  }

  function clearSelection() {
    selectedStudentId.value = null
    persistSelectedStudentId(null)
  }

  return {
    students,
    selectedStudentId,
    selectedStudent,
    addStudent,
    updateStudent,
    deleteStudent,
    selectStudent,
    clearSelection,
  }
}
