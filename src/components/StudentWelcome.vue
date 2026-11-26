<script setup>
import { computed } from 'vue'
import MadarLogo from '@/components/common/MadarLogo.vue'
import StudentAvatar from '@/components/common/StudentAvatar.vue'
import { getGradeLabel, getStageLabel } from '@/utils/education'

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['back'])

const stageLabel = computed(() => getStageLabel(props.student.stage))
const gradeLabel = computed(() => getGradeLabel(props.student.stage, props.student.grade))
</script>

<template>
  <div class="flex min-h-dvh flex-col justify-between px-4 py-8 sm:px-6 lg:px-8">
    <header class="mx-auto flex w-full max-w-4xl items-center justify-center">
      <MadarLogo />
    </header>

    <main class="mx-auto my-10 w-full max-w-xl">
      <section
        aria-labelledby="welcome-heading"
        class="rounded-2xl border border-[#2C3E57] bg-[#1C2B40] p-7 text-center sm:p-10"
      >
        <div class="flex justify-center">
          <StudentAvatar
            :name="student.fullName"
            :seed="student.id"
            size="lg"
          />
        </div>

        <h1
          id="welcome-heading"
          class="mt-6 text-2xl font-extrabold text-[#F8FAFC] sm:text-3xl"
        >
          أهلاً بك، {{ student.fullName }}
        </h1>

        <div class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span
            class="inline-flex items-center rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/12 px-3 py-1 font-semibold text-[#70C7F5]"
          >
            {{ stageLabel }}
          </span>
          <span class="font-medium text-[#A9BCD0]">
            {{ gradeLabel }}
          </span>
        </div>

        <p class="mt-5 text-base leading-relaxed text-[#A9BCD0]">
          مساحتك التعليمية المستقلة في منصة مدار جاهزة للانطلاق. هذه شاشة ترحيب
          مؤقتة ريثما يتم بناء لوحة التحكم الدراسية الكاملة.
        </p>

        <div class="mt-8">
          <button
            type="button"
            class="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#2C3E57] bg-[#101827] px-6 py-3 text-sm font-semibold text-[#F8FAFC] transition-colors duration-150 hover:border-[#3B82F6] hover:bg-[#3B82F6]/15 cursor-pointer"
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
      </section>
    </main>

    <footer class="mx-auto w-full max-w-4xl text-center">
      <p class="text-xs text-[#A9BCD0]/80 sm:text-sm">
        يمتلك كل طالب مساحة تعليمية مستقلة تحفظ بياناته وتقدمه الدراسي بشكل منفصل.
      </p>
    </footer>
  </div>
</template>
