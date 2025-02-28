<script setup lang="ts">
import InputComponent from './UI/InputComponent.vue'
import ButtonComponent from './UI/ButtonComponent.vue'
import { reactive, watch, ref } from 'vue'
import { useOrganizationStore } from '@/stores/useOrganizationStore'
import type { IOrganization } from '@/models/organization/OrganizationInterface'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close'])

const closeDialog = () => {
  emit('close')
}

const submitData = () => {
  useOrganizationStore().addOrganization(inputData)
  closeDialog()
}

const inputData = reactive<IOrganization>({
  id: Math.random(),
  name: '',
  owner: '',
  phone: ''
})

const disabled = ref(true)

watch(inputData, (newVal) => {
  if (newVal.name && newVal.owner && newVal.phone) {
    disabled.value = false
  } else {
    disabled.value = true
  }
})
</script>

<template>
  <main id="dialog_container">
    <div id="dialog_container_content">
      <h3>{{ title }}</h3>
      <InputComponent :placeholder="'Название'" :type="'text'" v-model="inputData.name" />
      <InputComponent :placeholder="'ФИО Директора'" :type="'text'" v-model="inputData.owner" />
      <InputComponent :placeholder="'Номер телефона'" :type="'tel'" v-model="inputData.phone" />
      <div id="dialog_container_content_buttons">
        <ButtonComponent @click="submitData" :disabled="disabled" :text="'Добавить'" :type="'confirm'" />
        <ButtonComponent @click="closeDialog" :text="'Отменить'" :type="'danger'" />
      </div>
    </div>
  </main>
</template>

<style scoped>
#dialog_container {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  place-items: center;
  place-content: center;
}

#dialog_container_content {
  background-color: #fff;
  display: flex;
  place-items: center;
  flex-direction: column;
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
}

#dialog_container_content_buttons {
  display: flex;
  gap: var(--spacing-md);
}
</style>
