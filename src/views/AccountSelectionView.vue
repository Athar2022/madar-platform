<script setup>
import { computed, ref } from 'vue'
import MadarLogo from '@/components/common/MadarLogo.vue'
import StudentCard from '@/components/StudentCard.vue'
import AddStudentCard from '@/components/AddStudentCard.vue'
import StudentFormModal from '@/components/StudentFormModal.vue'
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue'

const props = defineProps({
  students: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select', 'add', 'update', 'delete'])

const isFormModalOpen = ref(false)
const editingStudent = ref(null)

const isDeleteModalOpen = ref(false)
const deletingStudent = ref(null)

const statusMessage = ref('')
let statusTimer = null

const hasStudents = computed(() => props.students.length > 0)

function announceStatus(message) {
  clearTimeout(statusTimer)
  statusMessage.value = ''
  requestAnimationFrame(() => {
    statusMessage.value = message
  })
  statusTimer = setTimeout(() => {
    statusMessage.value = ''
  }, 4000)
}

function openAddModal() {
  editingStudent.value = null
  isFormModalOpen.value = true
}

function openEditModal(student) {
  editingStudent.value = student
  isFormModalOpen.value = true
}

function closeFormModal() {
  isFormModalOpen.value = false
  editingStudent.value = null
}

function handleFormSubmit(payload) {
  if (editingStudent.value) {
    emit('update', editingStudent.value.id, payload)
    announceStatus(`تم تحديث بيانات الطالب ${payload.fullName} بنجاح.`)
  } else {
    emit('add', payload)
    announceStatus(`تم إنشاء الملف الشخصي للطالب ${payload.fullName} بنجاح.`)
  }
  closeFormModal()
}

function openDeleteModal(student) {
  deletingStudent.value = student
  isDeleteModalOpen.value = true
}

function closeDeleteModal() {
  isDeleteModalOpen.value = false
  deletingStudent.value = null
}

function handleDeleteConfirm(studentId) {
  const deletedName = deletingStudent.value?.fullName ?? ''
  emit('delete', studentId)
  closeDeleteModal()
  if (deletedName) {
    announceStatus(`تم حذف الملف الشخصي للطالب ${deletedName}.`)
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
    <!-- Top Brand Header -->
    <header class="mx-auto flex w-full max-w-5xl items-center justify-center pt-2">
      <MadarLogo />
    </header>

    <!-- Main Account Selection Section -->
    <main class="mx-auto my-10 w-full max-w-5xl">
      <div class="mx-auto max-w-2xl text-center">
        <h1 class="text-3xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-4xl">
          كل رحلة تعلم تبدأ من هنا
        </h1>
        <p class="mt-3 text-base text-[#A9BCD0] sm:text-lg">
          اختر ملفك الشخصي لمتابعة رحلتك التعليمية.
        </p>
      </div>

      <!-- Accessible live announcement for screen readers -->
      <div aria-live="polite" class="visually-hidden">
        {{ statusMessage }}
      </div>

      <!-- Student Profiles Grid -->
      <div class="mt-10">
        <p
          v-if="!hasStudents"
          class="mb-6 text-center text-sm text-[#A9BCD0]"
        >
          لا توجد ملفات طلاب مسجلة حالياً. ابدأ بإضافة أول ملف شخصي.
        </p>

        <ul
          role="list"
          class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <li v-for="student in students" :key="student.id">
            <StudentCard
              :student="student"
              @select="emit('select', $event)"
              @edit="openEditModal"
              @delete="openDeleteModal"
            />
          </li>

          <li>
            <AddStudentCard @add="openAddModal" />
          </li>
        </ul>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mx-auto w-full max-w-5xl border-t border-[#2C3E57]/60 pt-6 text-center">
      <p class="text-xs leading-relaxed text-[#A9BCD0] sm:text-sm">
        يمتلك كل طالب مساحة تعليمية مستقلة تحفظ ملفه الشخصي ومستواه الدراسي على هذا الجهاز.
      </p>
    </footer>

    <!-- Create / Edit Student Modal -->
    <StudentFormModal
      :open="isFormModalOpen"
      :student="editingStudent"
      @close="closeFormModal"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal
      :open="isDeleteModalOpen"
      :student="deletingStudent"
      @close="closeDeleteModal"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>
