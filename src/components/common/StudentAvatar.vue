<script setup>
import { computed } from 'vue'
import { getAvatarTone, getStudentInitials } from '@/utils/education'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  seed: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['md', 'lg'].includes(value),
  },
})

const initials = computed(() => getStudentInitials(props.name))
const tone = computed(() => getAvatarTone(props.seed || props.name))

const sizeClass = computed(() =>
  props.size === 'lg' ? 'h-20 w-20 text-2xl' : 'h-14 w-14 text-lg',
)
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center rounded-2xl border font-bold tracking-wide"
    :class="sizeClass"
    :style="{
      backgroundColor: tone.bg,
      borderColor: tone.border,
      color: tone.text,
    }"
    aria-hidden="true"
  >
    {{ initials }}
  </div>
</template>
