<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const activeTab = ref(route.params.tab)

// tabs
const tabs = [
  {
    title: 'Account',
    icon: 'ri-group-line',
    tab: 'account',
  },
]
</script>

<template>
  <div>
    <h1>Contabilidad</h1>
  </div>
</template>
