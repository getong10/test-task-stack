import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IOrganization } from '@/models/organization/OrganizationInterface'

export const useOrganizationStore = defineStore('organization', () => {
  const organizations = ref<IOrganization[]>([])
  
  const getOrganizations = () => {
    return organizations.value
  }

  const setOrganizations = (organization: IOrganization[]) => {
    organizations.value = organization
  }

  const addOrganization = (organization: IOrganization) => {
    organizations.value.push(organization)
  }

  const deleteOrganization = (id: number) => {
    organizations.value = organizations.value.filter((organization) => organization.id !== id)
  }

  return { organizations, getOrganizations, setOrganizations, addOrganization, deleteOrganization }
})
