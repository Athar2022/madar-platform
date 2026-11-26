<script setup>
import { computed } from 'vue'
import { countSubjectUnitsAndLessons } from '@/services/curriculum'

const props = defineProps({
  subjects: {
    type: Array,
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

const hasSubjects = computed(() => props.subjects.length > 0)
</script>

<template>
  <section aria-labelledby="subjects-section-title" class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2
          id="subjects-section-title"
          class="text-xl font-bold text-[#F8FAFC]"
        >
          المواد الدراسية
        </h2>
        <p class="mt-1 text-sm text-[#A9BCD0]">
          المواد المخصصة لـ {{ gradeLabel }} ({{ stageLabel }})
        </p>
      </div>

      <span
        class="inline-flex items-center rounded-lg border border-[#2C3E57] bg-[#1C2B40] px-3 py-1.5 text-xs font-semibold text-[#70C7F5]"
      >
        {{ gradeLabel }}
      </span>
    </div>

    <!-- Populated grade subjects (ready for verified curriculum data) -->
    <ul
      v-if="hasSubjects"
      role="list"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="subject in subjects" :key="subject.id">
        <article
          class="flex h-full flex-col justify-between rounded-2xl border border-[#2C3E57] bg-[#1C2B40] p-5"
        >
          <div>
            <h3 class="text-base font-bold text-[#F8FAFC]">
              {{ subject.name }}
            </h3>
            <p
              v-if="subject.description"
              class="mt-1.5 text-sm leading-relaxed text-[#A9BCD0]"
            >
              {{ subject.description }}
            </p>
          </div>

          <div
            class="mt-4 flex items-center gap-4 border-t border-[#2C3E57]/70 pt-3 text-xs text-[#A9BCD0]"
          >
            <span>
              {{ countSubjectUnitsAndLessons(subject).unitsCount }} وحدات
            </span>
            <span>
              {{ countSubjectUnitsAndLessons(subject).lessonsCount }} دروس
            </span>
          </div>
        </article>
      </li>
    </ul>

    <!-- Clear Arabic empty state until verified curriculum data is added -->
    <div
      v-else
      class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#2C3E57] bg-[#1C2B40]/60 px-6 py-10 text-center sm:py-12"
    >
      <span
        class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/12 text-[#70C7F5]"
        aria-hidden="true"
      >
        <svg
          class="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
        </svg>
      </span>

      <h3 class="mt-4 text-base font-bold text-[#F8FAFC] sm:text-lg">
        لا توجد مواد دراسية مضافة لهذا الصف بعد
      </h3>
      <p class="mt-2 max-w-lg text-sm leading-relaxed text-[#A9BCD0]">
        سيتم إضافة المواد الدراسية المعتمدة والوحدات والدروس الخاصة بـ
        <strong class="font-semibold text-[#F8FAFC]">{{ gradeLabel }}</strong>
        فور اعتماد بيانات المنهج الدراسي وتوثيقها.
      </p>
    </div>
  </section>
</template>
