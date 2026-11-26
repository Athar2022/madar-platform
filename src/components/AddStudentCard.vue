<script setup>
const emit = defineEmits(['add'])
</script>

<template>
  <button
    type="button"
    class="group flex h-full min-h-[212px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#2C3E57] bg-[#1C2B40]/40 p-6 text-center transition-colors duration-150 hover:border-[#3B82F6] hover:bg-[#1C2B40]/85 cursor-pointer"
    @click="emit('add')"
  >
    <span
      class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#2C3E57] bg-[#101827] text-[#70C7F5] transition-colors duration-150 group-hover:border-[#3B82F6]/60 group-hover:bg-[#3B82F6]/15"
      aria-hidden="true"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </svg>
    </span>

    <div>
      <span class="block text-base font-bold text-[#F8FAFC]">
        إضافة طالب جديد
      </span>
      <span class="mt-1 block text-sm text-[#A9BCD0]">
        إنشاء مساحة تعليمية مستقلة
      </span>
    </div>
  </button>
</template>
