<script setup lang="ts">

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<template>
  <button
    class="button_component"
    :id="disabled ? 'disabled' : type"
    :disabled="disabled"
    @click="handleClick"
  >
    {{ text }}
  </button>
</template>

<style scoped>
@import url('../../styles/variables.css');

.button_component {
  border: none;
  border-radius: 5px;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
}

#confirm {
  background-color: var(--color-confirm-button-background);
  color: var(--color-primary-button-text);
}

#danger {
  background-color: var(--color-danger-button-background);
  color: var(--color-primary-button-text);
}

#disabled {
  background-color: var(--color-disabled-button-background);
  color: var(--color-disabled-button-text);
  cursor: not-allowed;
}
</style>