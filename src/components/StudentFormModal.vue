<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  STAGE_OPTIONS,
  getGradesForStage,
  isValidGradeForStage,
} from '@/utils/education'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  student: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const dialogRef = ref(null)
const fullNameInputRef = ref(null)
const primaryStageInputRef = ref(null)
const gradeSelectRef = ref(null)

const form = reactive({
  fullName: '',
  stage: '',
  grade: '',
})

const touched = reactive({
  fullName: false,
  stage: false,
  grade: false,
})

const submitted = ref(false)

const isEditMode = computed(() => Boolean(props.student))
const modalTitle = computed(() =>
  isEditMode.value ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد',
)
const submitLabel = computed(() =>
  isEditMode.value ? 'حفظ التعديلات' : 'إنشاء',
)

const availableGrades = computed(() => getGradesForStage(form.stage))

const errors = computed(() => {
  const trimmedName = form.fullName.trim()
  let fullNameError = ''
  if (!trimmedName) {
    fullNameError = 'الرجاء إدخال الاسم الكامل للطالب.'
  } else if (trimmedName.length < 2) {
    fullNameError = 'يجب أن يتكون الاسم الكامل من حرفين على الأقل.'
  }

  let stageError = ''
  if (form.stage !== 'primary' && form.stage !== 'secondary') {
    stageError = 'الرجاء اختيار المرحلة الدراسية.'
  }

  let gradeError = ''
  if (!form.grade || !isValidGradeForStage(form.stage, form.grade)) {
    gradeError = 'الرجاء اختيار الصف الدراسي.'
  }

  return {
    fullName: fullNameError,
    stage: stageError,
    grade: gradeError,
  }
})

const showFullNameError = computed(
  () => (submitted.value || touched.fullName) && Boolean(errors.value.fullName),
)
const showStageError = computed(
  () => (submitted.value || touched.stage) && Boolean(errors.value.stage),
)
const showGradeError = computed(
  () => (submitted.value || touched.grade) && Boolean(errors.value.grade),
)

function resetForm() {
  if (props.student) {
    form.fullName = props.student.fullName
    form.stage = props.student.stage
    form.grade = String(props.student.grade)
  } else {
    form.fullName = ''
    form.stage = ''
    form.grade = ''
  }
  touched.fullName = false
  touched.stage = false
  touched.grade = false
  submitted.value = false
}

function handleStageChange(stageValue) {
  form.stage = stageValue
  touched.stage = true
  if (form.grade && !isValidGradeForStage(stageValue, form.grade)) {
    form.grade = ''
    touched.grade = false
  }
}

function focusFirstInvalidField() {
  if (errors.value.fullName) {
    fullNameInputRef.value?.focus()
  } else if (errors.value.stage) {
    primaryStageInputRef.value?.focus()
  } else if (errors.value.grade) {
    gradeSelectRef.value?.focus()
  }
}

function handleSubmit() {
  submitted.value = true
  if (errors.value.fullName || errors.value.stage || errors.value.grade) {
    focusFirstInvalidField()
    return
  }

  emit('submit', {
    fullName: form.fullName.trim(),
    stage: form.stage,
    grade: Number(form.grade),
  })
}

function requestClose() {
  if (dialogRef.value?.open) {
    dialogRef.value.close()
  } else {
    emit('close')
  }
}

function handleNativeClose() {
  if (dialogRef.value) {
    dialogRef.value.returnValue = ''
  }
  if (props.open) {
    emit('close')
  }
}

// Fallback light-dismiss for browsers without <dialog closedby="any">
let pressedOutside = false
function isPointerOutsideDialog(event, dialog) {
  const rect = dialog.getBoundingClientRect()
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
}

function onPointerDown(event) {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  pressedOutside = isPointerOutsideDialog(event, dialog)
}

function onPointerUp(event) {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  if (pressedOutside && isPointerOutsideDialog(event, dialog)) {
    dialog.close()
  }
  pressedOutside = false
}

onMounted(() => {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  dialog.addEventListener('pointerdown', onPointerDown)
  dialog.addEventListener('pointerup', onPointerUp)
})

onBeforeUnmount(() => {
  const dialog = dialogRef.value
  if (!dialog) return
  dialog.removeEventListener('pointerdown', onPointerDown)
  dialog.removeEventListener('pointerup', onPointerUp)
})

watch(
  () => props.open,
  async (isOpen) => {
    const dialog = dialogRef.value
    if (!dialog) return

    if (isOpen) {
      resetForm()
      await nextTick()
      if (!dialog.open) {
        dialog.showModal()
      }
      fullNameInputRef.value?.focus()
    } else if (dialog.open) {
      dialog.close()
    }
  },
)
</script>

<template>
  <dialog
    ref="dialogRef"
    class="madar-dialog"
    closedby="any"
    aria-labelledby="student-modal-title"
    @close="handleNativeClose"
  >
    <div class="p-6 sm:p-7">
      <!-- Dialog Header -->
      <div class="flex items-start justify-between gap-4 pb-5 border-b border-[#2C3E57]">
        <div>
          <h1
            id="student-modal-title"
            class="text-xl font-bold text-[#F8FAFC]"
          >
            {{ modalTitle }}
          </h1>
          <p class="mt-1 text-sm text-[#A9BCD0]">
            {{
              isEditMode
                ? 'حدّث بيانات الطالب الدراسية ليتم حفظها في مساحته المستقلة.'
                : 'أدخل بيانات الطالب لإنشاء مساحة تعليمية مستقلة على هذا الجهاز.'
            }}
          </p>
        </div>

        <button
          type="button"
          aria-label="إغلاق النافذة"
          class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2C3E57] bg-[#101827]/50 text-[#A9BCD0] transition-colors duration-150 hover:bg-[#101827] hover:text-[#F8FAFC] cursor-pointer"
          @click="requestClose"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form
        novalidate
        aria-labelledby="student-modal-title"
        class="mt-6 space-y-5"
        @submit.prevent="handleSubmit"
      >
        <!-- Full Name -->
        <div>
          <label
            for="student-full-name"
            class="block text-sm font-semibold text-[#F8FAFC]"
          >
            الاسم الكامل
            <span class="text-[#70C7F5]" aria-hidden="true">*</span>
          </label>
          <input
            id="student-full-name"
            ref="fullNameInputRef"
            v-model="form.fullName"
            name="fullName"
            type="text"
            required
            autofocus
            maxlength="80"
            autocomplete="name"
            enterkeyhint="next"
            placeholder="مثال: سارة عبدالله الحربي"
            :aria-invalid="showFullNameError ? 'true' : 'false'"
            :aria-describedby="showFullNameError ? 'student-fullname-error' : undefined"
            class="mt-2 block min-h-12 w-full rounded-xl border bg-[#101827] px-4 py-3 text-base text-[#F8FAFC] placeholder:text-[#A9BCD0]/50 transition-colors duration-150"
            :class="
              showFullNameError
                ? 'border-red-400 focus-visible:outline-red-400'
                : 'border-[#2C3E57] hover:border-[#3B82F6]/60'
            "
            @blur="touched.fullName = true"
          />
          <p
            v-if="showFullNameError"
            id="student-fullname-error"
            class="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-300"
          >
            <svg
              class="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{{ errors.fullName }}</span>
          </p>
        </div>

        <!-- Educational Stage -->
        <fieldset
          :aria-describedby="showStageError ? 'student-stage-error' : undefined"
        >
          <legend class="block text-sm font-semibold text-[#F8FAFC]">
            المرحلة الدراسية
            <span class="text-[#70C7F5]" aria-hidden="true">*</span>
          </legend>

          <div class="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              v-for="(option, index) in STAGE_OPTIONS"
              :key="option.value"
              :for="`stage-${option.value}`"
              class="flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors duration-150"
              :class="
                form.stage === option.value
                  ? 'border-[#3B82F6] bg-[#3B82F6]/15 text-[#F8FAFC]'
                  : showStageError
                    ? 'border-red-400/80 bg-[#101827] text-[#A9BCD0] hover:border-red-400'
                    : 'border-[#2C3E57] bg-[#101827] text-[#A9BCD0] hover:border-[#3B82F6]/50 hover:text-[#F8FAFC]'
              "
            >
              <span class="text-sm font-semibold">{{ option.label }}</span>
              <input
                :id="`stage-${option.value}`"
                :ref="index === 0 ? (el) => (primaryStageInputRef = el) : undefined"
                type="radio"
                name="stage"
                :value="option.value"
                :checked="form.stage === option.value"
                required
                class="h-4 w-4 accent-[#3B82F6] cursor-pointer"
                @change="handleStageChange(option.value)"
              />
            </label>
          </div>

          <p
            v-if="showStageError"
            id="student-stage-error"
            class="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-300"
          >
            <svg
              class="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{{ errors.stage }}</span>
          </p>
        </fieldset>

        <!-- Grade Level -->
        <div>
          <label
            for="student-grade"
            class="block text-sm font-semibold text-[#F8FAFC]"
          >
            الصف الدراسي
            <span class="text-[#70C7F5]" aria-hidden="true">*</span>
          </label>
          <div class="relative mt-2">
            <select
              id="student-grade"
              ref="gradeSelectRef"
              v-model="form.grade"
              name="grade"
              required
              :disabled="!form.stage"
              :aria-invalid="showGradeError ? 'true' : 'false'"
              :aria-describedby="showGradeError ? 'student-grade-error' : undefined"
              class="block min-h-12 w-full appearance-none rounded-xl border bg-[#101827] py-3 ps-4 pe-10 text-base text-[#F8FAFC] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60"
              :class="
                showGradeError
                  ? 'border-red-400'
                  : 'border-[#2C3E57] hover:border-[#3B82F6]/60'
              "
              @blur="touched.grade = true"
              @change="touched.grade = true"
            >
              <option value="" disabled>
                {{
                  form.stage
                    ? 'اختر الصف الدراسي'
                    : 'اختر المرحلة الدراسية أولاً'
                }}
              </option>
              <option
                v-for="gradeItem in availableGrades"
                :key="gradeItem.value"
                :value="String(gradeItem.value)"
              >
                {{ gradeItem.label }}
              </option>
            </select>
            <svg
              class="pointer-events-none absolute top-1/2 end-3.5 h-5 w-5 -translate-y-1/2 text-[#A9BCD0]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          <p
            v-if="showGradeError"
            id="student-grade-error"
            class="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-300"
          >
            <svg
              class="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>{{ errors.grade }}</span>
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            class="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#2C3E57] bg-[#101827]/70 px-5 py-2.5 text-sm font-semibold text-[#A9BCD0] transition-colors duration-150 hover:bg-[#101827] hover:text-[#F8FAFC] cursor-pointer"
            @click="requestClose"
          >
            إلغاء
          </button>

          <button
            type="submit"
            class="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-colors duration-150 hover:bg-[#3B82F6] cursor-pointer"
          >
            {{ submitLabel }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
