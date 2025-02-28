<script setup lang="ts">
import InputComponent from '@/components/UI/InputComponent.vue';
import TableComponent from '@/components/TableComponent.vue';
import ButtonComponent from '@/components/UI/ButtonComponent.vue';
import DialogComponent from '@/components/DialogComponent.vue';
import { useOrganizationStore } from '@/stores/useOrganizationStore';
import { onBeforeMount, ref, computed } from 'vue';
import organization from '@/models/data/organizations.json'

let isModalOpen = ref(false)

const sortKey = ref('')
const sortOrder = ref(1)

onBeforeMount(() => {
  useOrganizationStore().setOrganizations(organization)
})

const searchQuery = ref('')

const filteredOrganizations = computed(() => {
  page.value = 1

  let filteredOrganizations = useOrganizationStore().getOrganizations().filter((organization) => organization.owner.includes(searchQuery.value))
  
  if (sortKey.value) {
    filteredOrganizations.sort((a, b) => {
      const A = a[sortKey.value]
      const B = b[sortKey.value]
      if (A === B) return 0
      if (A > B) return sortOrder.value
      if (A < B) return sortOrder.value * -1
    })
  }
  return filteredOrganizations
})

const handleSort = ({key, order}: {key: string, order: number}) => {
  sortKey.value = key
  sortOrder.value = order
}

const page = ref(1)
const pageSize = ref(5)
const totalPages = computed(() => {
  return Math.ceil(filteredOrganizations.value.length / pageSize.value)
})

const paginatedOrganizations = computed(() => {
  const startIndex = (page.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return filteredOrganizations.value.slice(startIndex, endIndex)
})

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
  }
}

const previousPage = () => {
  if (page.value > 1) {
    page.value--
  }
}
</script>

<template>
  <main id="table_view_container">
    <div id="table_view_container_header">
      <InputComponent :placeholder="'Найти по ФИО'" :type="'text'" v-model="searchQuery" />
      <ButtonComponent text="Добавить" type="confirm" @click="isModalOpen = true"/>
    </div>

    <TableComponent :data="paginatedOrganizations" :sort-key="sortKey" :sort-order="sortOrder" @sort="handleSort" />

    <div id="table_view_container_pagination">
      <ButtonComponent :disabled="page === 1" :text="'Предыдущая'" :type="'confirm'" @click="previousPage" />
      <span>{{ page }} / {{ totalPages }}</span>
      <ButtonComponent :disabled="page === totalPages" :text="'Следующая'" :type="'confirm'" @click="nextPage" />
    </div>

    <DialogComponent v-if="isModalOpen" v-model="isModalOpen" @close="isModalOpen = false" title="Добавить организацию" />
  </main>
</template>

<style scoped>
@import '@/styles/variables.css';

#table_view_container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: var(--spacing-lg);
  gap: var(--spacing-lg);
}

#table_view_container_header {
  width: 70%;
  height: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#table_view_container_pagination {
  width: 70%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
}
</style>
