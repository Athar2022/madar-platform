<script setup>
defineProps({
  studentName: {
    type: String,
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
</script>

<template>
  <section
    aria-labelledby="dashboard-welcome-title"
    class="rounded-2xl border border-[#2C3E57] bg-[#1C2B40] p-6 sm:p-8"
  >
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span
            class="inline-flex items-center rounded-md border border-[#3B82F6]/30 bg-[#3B82F6]/15 px-2.5 py-1 text-[#70C7F5]"
          >
            {{ stageLabel }}
          </span>
          <span
            class="inline-flex items-center rounded-md border border-[#2C3E57] bg-[#101827]/70 px-2.5 py-1 text-[#A9BCD0]"
          >
            {{ gradeLabel }}
          </span>
        </div>

        <h1
          id="dashboard-welcome-title"
          class="mt-3 text-2xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-3xl"
        >
          مرحباً بك، {{ studentName }}
        </h1>

        <p class="mt-2 max-w-2xl text-sm leading-relaxed text-[#A9BCD0] sm:text-base">
          مساحتك الدراسية المستقلة جاهزة لمساعدتك على تنظيم تعلمك ومتابعة مسيرتك
          التعليمية بخطوات ثابتة.
        </p>
      </div>
    </div>
  </section>
</template>
