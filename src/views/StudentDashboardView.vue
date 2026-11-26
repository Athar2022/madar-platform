<script setup>
import { computed } from 'vue'
import { getGradeLabel, getStageLabel } from '@/utils/education'
import { getSubjectsForGrade } from '@/services/curriculum'
import DashboardHeader from '@/components/dashboard/DashboardHeader.vue'
import DashboardWelcome from '@/components/dashboard/DashboardWelcome.vue'
import SubjectsSection from '@/components/dashboard/SubjectsSection.vue'
import LearningShortcuts from '@/components/dashboard/LearningShortcuts.vue'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['back'])

const stageLabel = computed(() => getStageLabel(props.student.stage))
const gradeLabel = computed(() =>
  getGradeLabel(props.student.stage, props.student.grade),
)
const subjects = computed(() =>
  getSubjectsForGrade(props.student.stage, props.student.grade),
)
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-[#101827]">
    <DashboardHeader
      :student="student"
      :stage-label="stageLabel"
      :grade-label="gradeLabel"
      @back="emit('back')"
    />

    <main
      class="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-6 lg:px-8"
    >
      <DashboardWelcome
        :student-name="student.fullName"
        :stage-label="stageLabel"
        :grade-label="gradeLabel"
      />

      <SubjectsSection
        :subjects="subjects"
        :stage-label="stageLabel"
        :grade-label="gradeLabel"
      />

      <LearningShortcuts />
    </main>

    <footer
      class="mx-auto w-full max-w-6xl border-t border-[#2C3E57]/60 px-4 py-6 text-center sm:px-6 lg:px-8"
    >
      <p class="text-xs leading-relaxed text-[#A9BCD0] sm:text-sm">
        مساحة الطالب {{ student.fullName }} المستقلة — {{ stageLabel }}،
        {{ gradeLabel }}.
      </p>
    </footer>
  </div>
</template>
