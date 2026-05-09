<template>
  <VForm>
    <VContainer>
      <!-- Inputs -->
      <VRow
        align="start"
        dense
      >
        <VCol
          cols="12"
          md="4"
        >
          <VDateInput
            v-model="date"
            label="Fecha"
            variant="outlined"
            rounded="lg"
            append-inner-icon="ri-calendar-line"
            :error-messages="errors(v$.date)"
            hide-details="auto"
            show-adjacent-months
          />
        </VCol>

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
            hide-details="auto"
          />
        </VCol>

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
            hide-details="auto"
          />
        </VCol>
      </VRow>

      <!-- Botón -->
      <div class="d-flex justify-end mt-4">
        <VBtn
          color="primary"
          @click="submit"
        >
          Contabilizar
        </VBtn>
      </div>
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
