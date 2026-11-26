<script setup>
import { watch } from 'vue'
import { useStudentAccounts } from '@/composables/useStudentAccounts'
import AccountSelectionView from '@/views/AccountSelectionView.vue'
import StudentWelcome from '@/components/StudentWelcome.vue'

const {
  students,
  selectedStudent,
  addStudent,
  updateStudent,
  deleteStudent,
  selectStudent,
  clearSelection,
} = useStudentAccounts()

watch(
  selectedStudent,
  (student) => {
    document.title = student
      ? `مدار | أهلاً بك ${student.fullName}`
      : 'مدار | اختيار حساب الطالب'
  },
  { immediate: true },
)
</script>

<template>
  <StudentWelcome
    v-if="selectedStudent"
    :student="selectedStudent"
    @back="clearSelection"
  />

  <AccountSelectionView
    v-else
    :students="students"
    @select="selectStudent"
    @add="addStudent"
    @update="updateStudent"
    @delete="deleteStudent"
  />
</template>
