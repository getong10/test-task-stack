<script setup lang="ts">
import type { IOrganization } from '@/models/organization/OrganizationInterface'
import { reactive, type PropType } from 'vue'
import ButtonComponent from './UI/ButtonComponent.vue'
import { useOrganizationStore } from '@/stores/useOrganizationStore'

const props = defineProps({
  data: {
    type: Array as PropType<IOrganization[]>,
    required: true
  },
  sortKey: {
    type: String,
    required: false,
    default: 'asc'
  },
  sortOrder: {
    type: Number,
    required: false,
    default: 1
  }
})

const deleteOrganization = (id: number) => {
  useOrganizationStore().deleteOrganization(id)
}

const clickCount = reactive({})

const emit = defineEmits(['sort'])

const handleSort = (column: string) => {
  const currentCount = clickCount[column] || 0
  clickCount[column] = (currentCount + 1)%3

  if (clickCount[column] === 0) {
    emit('sort', { key: '', order: 1 })
  } else {
    emit('sort', { key: column, order: clickCount[column] === 1 ? 1 : -1 })
  } 
}
</script>

<template>
  <table id="table_container">
    <thead>
      <tr>
        <th @click="handleSort('name')">
          Название
          <span v-if="sortKey === 'name' && sortOrder === 1">↑</span>
          <span v-else-if="sortKey === 'name' && sortOrder === -1">↓</span>
        </th>
        <th @click="handleSort('owner')">
          ФИО Директора
          <span v-if="sortKey === 'owner' && sortOrder === 1">↑</span>
          <span v-else-if="sortKey === 'owner' && sortOrder === -1">↓</span>
        </th>
        <th>
          Номер телефона
        </th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="item in data" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.owner }}</td>
        <td>{{ item.phone }}</td>
        <td>
          <ButtonComponent text="X" type="danger" @click="deleteOrganization(item.id)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
#table_container {
  width: 70%;
  border-collapse: collapse;
  border: 1px solid #000;
}

#table_container th, #table_container td {
  border: 1px solid #000;
  padding: 5px;
}

#table_container tbody td:last-child {
  text-align: center;
}
</style>