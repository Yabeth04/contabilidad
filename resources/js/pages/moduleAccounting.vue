<template>
  <VForm>
    <VContainer>
      <!-- Inputs -->
      <VRow
        align="start"
        dense
      >
        <!-- Fecha -->
        <VCol
          cols="12"
          md="4"
        >
          <VDateInput
            v-model="date"
            label="Fecha"
            variant="outlined"
            rounded="lg"
            prepend-icon=""
            append-inner-icon="ri-calendar-line"
            :error-messages="errors(v$.date)"
            hide-details="auto"
            show-adjacent-months
          />
        </VCol>

        <!-- Tipo de movimiento -->
        <VCol
          cols="12"
          md="4"
        >
          <VSelect
            v-model="selectedMovementType"
            label="Tipo de movimiento"
            :items="movementTypes"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.selectedMovementType)"
            hide-details="auto"
          />
        </VCol>

        <!-- Tipo de pago -->
        <VCol
          cols="12"
          md="4"
        >
          <VSelect
            v-model="selectedPaymentType"
            label="Tipo de pago"
            :items="paymentTypes"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.selectedPaymentType)"
            hide-details="auto"
          />
        </VCol>

        <!-- Monto -->
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
      movementTypes: [
        { title: 'Ingreso', value: 'haber' },
        { title: 'Gasto', value: 'debe' },
      ],
      paymentTypes: [
        { title: 'Sinpe', value: 'sinpe' },
        { title: 'Efectivo', value: 'efectivo' },
        { title: 'Tarjeta', value: 'tarjeta' },
        { title: 'Transferencia', value: 'transferencia' },
        { title: 'Otros', value: 'otros' },
      ],
      selectedPaymentType: null,
      selectedMovementType: null,
      amount: '',
    }
  },

  validations() {
    return {
      date: {
        required: helpers.withMessage('Fecha requerida', required),
      },
      selectedMovementType: {
        required: helpers.withMessage('Tipo de movimiento requerido', required),
      },
      amount: {
        required: helpers.withMessage('Monto requerido', required),
        decimal: helpers.withMessage('Ingresa un monto válido', decimal),
      },
      selectedPaymentType: {
        required: helpers.withMessage('Tipo de pago requerido', required),
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
