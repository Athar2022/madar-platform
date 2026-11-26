<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  student: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'confirm'])

const dialogRef = ref(null)
const cancelButtonRef = ref(null)

function requestClose() {
  if (dialogRef.value?.open) {
    dialogRef.value.close()
  } else {
    emit('close')
  }
}

function handleConfirm() {
  if (!props.student) return
  emit('confirm', props.student.id)
}

function handleNativeClose() {
  if (dialogRef.value) {
    dialogRef.value.returnValue = ''
  }
  if (props.open) {
    emit('close')
  }
}

let pressedOutside = false
function isPointerOutsideDialog(event, dialog) {
  const rect = dialog.getBoundingClientRect()
  return (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
}

function onPointerDown(event) {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  pressedOutside = isPointerOutsideDialog(event, dialog)
}

function onPointerUp(event) {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  if (pressedOutside && isPointerOutsideDialog(event, dialog)) {
    dialog.close()
  }
  pressedOutside = false
}

onMounted(() => {
  const dialog = dialogRef.value
  if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return
  dialog.addEventListener('pointerdown', onPointerDown)
  dialog.addEventListener('pointerup', onPointerUp)
})

onBeforeUnmount(() => {
  const dialog = dialogRef.value
  if (!dialog) return
  dialog.removeEventListener('pointerdown', onPointerDown)
  dialog.removeEventListener('pointerup', onPointerUp)
})

watch(
  () => props.open,
  async (isOpen) => {
    const dialog = dialogRef.value
    if (!dialog) return

    if (isOpen) {
      await nextTick()
      if (!dialog.open) {
        dialog.showModal()
      }
      cancelButtonRef.value?.focus()
    } else if (dialog.open) {
      dialog.close()
    }
  },
)
</script>

<template>
  <dialog
    ref="dialogRef"
    class="madar-dialog"
    closedby="any"
    aria-labelledby="delete-modal-title"
    @close="handleNativeClose"
  >
    <div class="p-6 sm:p-7">
      <div class="flex items-start gap-3.5">
        <span
          class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/15 text-red-300"
          aria-hidden="true"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        </span>

        <div class="min-w-0 flex-1">
          <h1
            id="delete-modal-title"
            class="text-lg font-bold text-[#F8FAFC]"
          >
            تأكيد حذف الملف الشخصي
          </h1>
          <p class="mt-2 text-sm leading-relaxed text-[#A9BCD0]">
            هل أنت متأكد من رغبتك في حذف ملف الطالب
            <strong class="font-bold text-[#F8FAFC]">
              {{ student?.fullName }}
            </strong>
            ؟ سيتم إزالة الملف من هذا الجهاز ولا يمكن التراجع عن هذا الإجراء.
          </p>
        </div>
      </div>

      <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          ref="cancelButtonRef"
          type="button"
          autofocus
          class="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#2C3E57] bg-[#101827]/70 px-5 py-2.5 text-sm font-semibold text-[#F8FAFC] transition-colors duration-150 hover:bg-[#101827] cursor-pointer"
          @click="requestClose"
        >
          إلغاء
        </button>

        <button
          type="button"
          class="inline-flex min-h-11 items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-red-500 cursor-pointer"
          @click="handleConfirm"
        >
          تأكيد الحذف
        </button>
      </div>
    </div>
  </dialog>
</template>
