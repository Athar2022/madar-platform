<script setup>
import MadarLogo from '@/components/common/MadarLogo.vue'
import StudentAvatar from '@/components/common/StudentAvatar.vue'

defineProps({
  student: {
    type: Object,
    required: true,
  },
  stageLabel: {
    type: String,
    required: true,
  },
  gradeLabel: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['back'])
</script>

<template>
  <header class="border-b border-[#2C3E57]/70 bg-[#101827]">
    <div
      class="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
    >
      <!-- Brand -->
      <MadarLogo />

      <!-- Student Identity & Switch Account Action -->
      <div class="flex flex-wrap items-center gap-3 sm:gap-4">
        <div
          class="flex min-w-0 items-center gap-3 rounded-2xl border border-[#2C3E57] bg-[#1C2B40] px-3.5 py-2"
        >
          <StudentAvatar
            :name="student.fullName"
            :seed="student.id"
            size="sm"
          />

          <div class="min-w-0 text-start">
            <p class="truncate text-sm font-bold text-[#F8FAFC]">
              {{ student.fullName }}
            </p>
            <p class="text-xs text-[#A9BCD0]">
              <span>{{ stageLabel }}</span>
              <span class="mx-1.5 text-[#2C3E57]" aria-hidden="true">•</span>
              <span class="text-[#70C7F5]">{{ gradeLabel }}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#2C3E57] bg-[#1C2B40] px-4 py-2 text-sm font-semibold text-[#F8FAFC] transition-colors duration-150 hover:border-[#3B82F6] hover:bg-[#22344D] cursor-pointer"
          @click="emit('back')"
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
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>العودة إلى اختيار الحساب</span>
        </button>
      </div>
    </div>
  </header>
</template>
