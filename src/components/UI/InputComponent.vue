<script setup lang="ts">
const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    id="input_component"
    :type="type"
    :placeholder="placeholder"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
@import url('@/styles/variables.css');

#input_component {
  border: 1px solid #cccccc;
  border-radius: 5px;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-primary-text);
}

#input_component:focus {
  outline: none;
  border: 1px solid var(--color-primary-text);
}
</style>
