<script setup>
const SHORTCUT_ITEMS = [
  {
    id: 'lessons',
    title: 'الدروس',
    description: 'تصفح الوحدات التعليمية وشروحات الدروس المرتبطة بصفك الدراسي.',
    status: 'قريباً',
    iconBg: 'bg-[#3B82F6]/15 border-[#3B82F6]/35 text-[#70C7F5]',
    badgeClass: 'border-[#3B82F6]/35 bg-[#3B82F6]/15 text-[#70C7F5]',
  },
  {
    id: 'quizzes',
    title: 'الاختبارات',
    description: 'تدريبات وأسئلة مراجعة تساعدك على قياس استيعابك بعد كل وحدة.',
    status: 'قريباً',
    iconBg: 'bg-sky-400/12 border-sky-400/35 text-[#70C7F5]',
    badgeClass: 'border-sky-400/35 bg-sky-400/12 text-[#70C7F5]',
  },
  {
    id: 'progress',
    title: 'تقدمي الدراسي',
    description: 'عرض ملخص إنجازك ونسبة إتمام الدروس والأنشطة عبر المواد.',
    status: 'قريباً',
    iconBg: 'bg-teal-400/12 border-teal-400/35 text-teal-300',
    badgeClass: 'border-teal-400/35 bg-teal-400/12 text-teal-300',
  },
]
</script>

<template>
  <section aria-labelledby="shortcuts-section-title" class="space-y-4">
    <div>
      <h2
        id="shortcuts-section-title"
        class="text-xl font-bold text-[#F8FAFC]"
      >
        أقسام التعلم
      </h2>
      <p class="mt-1 text-sm text-[#A9BCD0]">
        الأدوات التعليمية الأساسية التي ستتوفر داخل مساحتك الدراسية.
      </p>
    </div>

    <ul
      role="list"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <li v-for="item in SHORTCUT_ITEMS" :key="item.id">
        <article
          class="flex h-full flex-col justify-between rounded-2xl border border-[#2C3E57] bg-[#1C2B40] p-5"
        >
          <div class="flex items-start justify-between gap-3">
            <span
              class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
              :class="item.iconBg"
              aria-hidden="true"
            >
              <!-- Lessons Icon -->
              <svg
                v-if="item.id === 'lessons'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>

              <!-- Quizzes Icon -->
              <svg
                v-else-if="item.id === 'quizzes'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="m9 14 2 2 4-4" />
              </svg>

              <!-- Progress Icon -->
              <svg
                v-else
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </span>

            <span
              class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
              :class="item.badgeClass"
            >
              {{ item.status }}
            </span>
          </div>

          <div class="mt-4">
            <h3 class="text-base font-bold text-[#F8FAFC]">
              {{ item.title }}
            </h3>
            <p class="mt-1.5 text-sm leading-relaxed text-[#A9BCD0]">
              {{ item.description }}
            </p>
          </div>
        </article>
      </li>
    </ul>
  </section>
</template>
