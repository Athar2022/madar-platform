<script setup>
import { computed, ref } from 'vue'
import StudentAvatar from '@/components/common/StudentAvatar.vue'
import { getGradeLabel, getStageLabel } from '@/utils/education'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select', 'edit', 'delete'])

const triggerRef = ref(null)
const menuRef = ref(null)
const isMenuOpen = ref(false)

const menuId = computed(() => `student-menu-${props.student.id}`)
const stageLabel = computed(() => getStageLabel(props.student.stage))
const gradeLabel = computed(() => getGradeLabel(props.student.stage, props.student.grade))

function positionPopoverFallback() {
  const trigger = triggerRef.value
  const menu = menuRef.value
  if (!trigger || !menu) return
  if (typeof CSS !== 'undefined' && CSS.supports?.('position-area: block-end')) return

  const rect = trigger.getBoundingClientRect()
  const menuRect = menu.getBoundingClientRect()
  const viewportPadding = 12
  const gap = 6

  let top = rect.bottom + gap
  if (top + menuRect.height > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, rect.top - menuRect.height - gap)
  }

  // Align to inline-start in RTL (right edge of trigger) and clamp within viewport
  const isRtl = document.documentElement.dir === 'rtl'
  let left = isRtl ? rect.right - menuRect.width : rect.left
  left = Math.max(
    viewportPadding,
    Math.min(left, window.innerWidth - menuRect.width - viewportPadding),
  )

  menu.style.top = `${top}px`
  menu.style.left = `${left}px`
}

function handleMenuToggle(event) {
  isMenuOpen.value = event.newState === 'open'
  if (isMenuOpen.value) {
    positionPopoverFallback()
  }
}

function closeMenu() {
  if (menuRef.value && isMenuOpen.value) {
    menuRef.value.hidePopover?.()
  }
}

function handleEdit() {
  closeMenu()
  emit('edit', props.student)
}

function handleDelete() {
  closeMenu()
  emit('delete', props.student)
}
</script>

<template>
  <article
    class="flex h-full min-h-[212px] flex-col justify-between rounded-2xl border border-[#2C3E57] bg-[#1C2B40] p-5 transition-colors duration-150 hover:border-[#3B82F6]/60 hover:bg-[#22344D]"
  >
    <!-- Card Header: Avatar, Student Info, Management Menu -->
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 items-start gap-3.5">
        <StudentAvatar :name="student.fullName" :seed="student.id" />

        <div class="min-w-0 pt-0.5">
          <h2 class="text-lg font-bold text-[#F8FAFC] leading-snug break-words">
            {{ student.fullName }}
          </h2>

          <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span
              class="inline-flex items-center rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/12 px-2.5 py-0.5 font-semibold text-[#70C7F5]"
            >
              {{ stageLabel }}
            </span>
            <span class="font-medium text-[#A9BCD0]">
              {{ gradeLabel }}
            </span>
          </div>
        </div>
      </div>

      <!-- Management Menu Trigger & Popover -->
      <div class="shrink-0">
        <button
          ref="triggerRef"
          type="button"
          :popovertarget="menuId"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          :aria-controls="menuId"
          :aria-label="`إدارة ملف ${student.fullName}`"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-[#A9BCD0] transition-colors duration-150 hover:border-[#2C3E57] hover:bg-[#101827]/70 hover:text-[#F8FAFC] cursor-pointer"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
          </svg>
        </button>

        <div
          :id="menuId"
          ref="menuRef"
          popover="auto"
          class="madar-popover-menu"
          @toggle="handleMenuToggle"
        >
          <div class="flex flex-col gap-1">
            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-[#F8FAFC] transition-colors duration-150 hover:bg-[#22344D] cursor-pointer"
              @click="handleEdit"
            >
              <svg
                class="h-4 w-4 shrink-0 text-[#70C7F5]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              <span>تعديل البيانات</span>
            </button>

            <button
              type="button"
              class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm font-medium text-red-300 transition-colors duration-150 hover:bg-red-500/15 hover:text-red-200 cursor-pointer"
              @click="handleDelete"
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
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" x2="10" y1="11" y2="17" />
                <line x1="14" x2="14" y1="11" y2="17" />
              </svg>
              <span>حذف الملف</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Accessible Entry Action -->
    <div class="mt-6 pt-4 border-t border-[#2C3E57]/70">
      <button
        type="button"
        :aria-label="`الدخول إلى المساحة التعليمية للطالب ${student.fullName}`"
        class="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#3B82F6]/35 bg-[#3B82F6]/14 px-4 py-2.5 text-sm font-semibold text-[#70C7F5] transition-colors duration-150 hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-[#F8FAFC] cursor-pointer"
        @click="emit('select', student.id)"
      >
        <span>الدخول إلى المساحة التعليمية</span>
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
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
    </div>
  </article>
</template>
