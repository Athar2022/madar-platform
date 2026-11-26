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
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const initials = computed(() => getStudentInitials(props.name))
const tone = computed(() => getAvatarTone(props.seed || props.name))

const sizeClass = computed(() => {
  if (props.size === 'sm') return 'h-10 w-10 rounded-xl text-sm'
  if (props.size === 'lg') return 'h-20 w-20 rounded-2xl text-2xl'
  return 'h-14 w-14 rounded-2xl text-lg'
})
</script>

<template>
  <div
    class="inline-flex shrink-0 items-center justify-center border font-bold tracking-wide"
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
