<template>
  <VForm>
    <VContainer>
      <VRow>
        <!-- Fecha -->
        <VCol
          cols="12"
          md="4"
        >
          <VDateInput
            v-model="date"
            label="Fecha"
            placeholder="dd/mm/aaaa"
            variant="outlined"
            rounded="lg"
            hide-actions
            prepend-icon=""
            append-inner-icon="ri-calendar-line"
            :error-messages="errors(v$.date)"
            required
            show-adjacent-months
          />
        </VCol>

        <!-- selection type -->
        <VCol
          cols="12"
          md="4"
        >
          <VSelect
            v-model="selectedType"
            label="Tipo de movimiento"
            :items="types"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.selectedType)"
          />
        </VCol>

        <!-- monto -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.amount.$model"
            type="number"
            label="Monto"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.amount)"
          />
        </VCol>
      </VRow>

      <!-- Contabilizar -->
      <VRow class="mt-6">
        <VCol cols="12">
          <VBtn
            color="primary"
            @click="submit"
          >
            Contabilizar
          </VBtn>
        </VCol>
      </VRow>
    </VContainer>
  </VForm>
</template>

<script>
import submittedVuelidateForm from '@/mixins/submittedVuelidateForm'
import { useVuelidate } from '@vuelidate/core'
import { decimal, helpers, required } from '@vuelidate/validators'

export default {
  name: 'ModuleAccounting',
  mixins: [submittedVuelidateForm],

  setup() {
    return {
      v$: useVuelidate(),
    }
  },

  data() {
    return {
      date: new Date(),
      types: [
        { title: 'Ingreso', value: 'haber' },
        { title: 'Gasto', value: 'debe' },
      ],
      selectedType: null,
      amount: '',
    }
  },

  validations() {
    return {
      date: {
        required: helpers.withMessage('Fecha requerida', required),
      },
      selectedType: {
        required: helpers.withMessage('Tipo de movimiento requerido', required),
      },
      amount: {
        required: helpers.withMessage('Monto requerido', required),
        decimal: helpers.withMessage('Ingresa un monto válido', decimal),
      },
    }
  },

  methods: {
    async submit() {
      this.submitted = true

      const isValid = await this.v$.$validate()

      if (!isValid) {
        return
      }
    },
  },
}
</script>
