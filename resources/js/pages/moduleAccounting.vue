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

        <!-- Descripción -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="description"
            type="text"
            label="Descripción"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
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
            :class="mdAndUp ? 'monto-with-action' : undefined"
            type="number"
            label="Monto"
            variant="outlined"
            rounded="lg"
            hide-spin-buttons
            hide-details="auto"
            :error-messages="errors(v$.amount)"
            @keyup.enter="storeAccounting"
          >
            <template #append-inner>
              <VBtn
                v-if="mdAndUp"
                color="primary"
                variant="flat"
                class="monto-with-action__btn rounded-s-0 rounded-e-lg"
                aria-label="Contabilizar"
                tabindex="-1"
                @click.stop="storeAccounting"
              >
                <VIcon
                  icon="ri-arrow-right-line"
                  size="22"
                />
              </VBtn>
            </template>
          </VTextField>
        </VCol>
      </VRow>

      <!-- Móvil / tablet: botón completo -->
      <div
        v-if="mdAndDown"
        class="d-flex justify-end mt-4"
      >
        <VBtn
          color="primary"
          rounded="lg"
          block
          @click="storeAccounting"
        >
          Contabilizar
        </VBtn>
      </div>
    </VContainer>
  </VForm>

  <VContainer class="pa-0 mt-6">
    <VCard
      variant="outlined"
      rounded="lg"
      class="accounting-table-card overflow-hidden"
    >
      <VDivider />

      <!-- Escritorio / tablet ancha: tabla -->
      <VTable
        v-if="mdAndUp"
        class="accounting-table"
        density="comfortable"
        fixed-header
        height="min(400px, 55vh)"
        hover
      >
        <thead>
          <tr>
            <th
              class="accounting-table__th text-start"
              width="120px"
            >
              Fecha
            </th>
            <th class="accounting-table__th text-start">
              Descripción
            </th>
            <th class="accounting-table__th text-end">
              Debe / Ingreso
            </th>
            <th class="accounting-table__th text-end">
              Haber / Gasto
            </th>
            <th class="accounting-table__th text-start accounting-table__th--narrow">
              Tipo de pago
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in accounting"
            :key="item.id"
          >
            <td class="text-body-2 text-medium-emphasis">
              {{ item.date }}
            </td>
            <td class="text-body-2">
              {{ item.description || '—' }}
            </td>
            <td class="text-end accounting-table__num">
              {{ item.movement_type === 'debe' ? $formatAmount(item.amount) : '—' }}
            </td>
            <td class="text-end accounting-table__num">
              {{ item.movement_type === 'haber' ? $formatAmount(item.amount) : '—' }}
            </td>
            <td>
              <VChip
                size="small"
                variant="tonal"
                color="primary"
                class="text-caption font-weight-medium"
              >
                {{ paymentTypeLabel(item.payment_type) }}
              </VChip>
            </td>
          </tr>

          <!-- Carga más movimientos -->
          <tr>
            <td colspan="5">
              <VInfiniteScroll
                side="end"
                @load="showAccounting"
              />
            </td>
          </tr>
        </tbody>
      </VTable>

      <!-- Móvil / tablet estrecha: lista de tarjetas + scroll infinito -->
      <VInfiniteScroll
        v-if="mdAndDown"
        side="end"
        class="accounting-mobile-list"
        @load="showAccounting"
      >
        <div class="pa-3">
          <template v-if="accounting.length">
            <VCard
              v-for="item in accounting"
              :key="item.id"
              variant="outlined"
              rounded="lg"
              class="accounting-mobile-card mb-3"
            >
              <VCardText class="pa-4">
                <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-2">
                  <span class="text-caption text-medium-emphasis">{{ item.date }}</span>
                  <VChip
                    size="small"
                    variant="tonal"
                    color="primary"
                    class="text-caption font-weight-medium"
                  >
                    {{ paymentTypeLabel(item.payment_type) }}
                  </VChip>
                </div>
                <p class="text-body-2 mb-3">
                  {{ item.description || '—' }}
                </p>
                <div class="d-flex justify-space-between gap-4 text-body-2">
                  <div>
                    <span class="text-medium-emphasis text-caption d-block mb-1">Debe</span>
                    <span class="accounting-table__num font-weight-medium">
                      {{ item.movement_type === 'debe' ? $formatAmount(item.amount) : '—' }}
                    </span>
                  </div>
                  <div class="text-end">
                    <span class="text-medium-emphasis text-caption d-block mb-1">Haber</span>
                    <span class="accounting-table__num font-weight-medium">
                      {{ item.movement_type === 'haber' ? $formatAmount(item.amount) : '—' }}
                    </span>
                  </div>
                </div>
              </VCardText>
            </VCard>
          </template>
          <p
            v-else
            class="text-body-2 text-medium-emphasis text-center py-8"
          >
            No hay movimientos todavía.
          </p>
        </div>
      </VInfiniteScroll>
    </VCard>
  </VContainer>
</template>

<script>
import submittedVuelidateForm from '@/mixins/submittedVuelidateForm'
import { useVuelidate } from '@vuelidate/core'
import { decimal, helpers, required } from '@vuelidate/validators'
import axios from 'axios'
import { useDisplay } from 'vuetify'

export default {
  name: 'ModuleAccounting',
  mixins: [submittedVuelidateForm],

  setup() {
    const { mdAndUp, mdAndDown } = useDisplay()

    return {
      v$: useVuelidate(),
      mdAndUp, // para usar en el campo monto (pantallas md y superiores)
      mdAndDown, // para usar en el botón completo (pantallas md y menores)
    }
  },

  data() {
    return {
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
      date: new Date(),
      selectedPaymentType: null,
      selectedMovementType: null,
      amount: '',
      description: '',
      accounting: [],
      page: 1,
      hasMore: true,
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
  mounted() {
    this.showAccounting()
  },
  methods: {
    async storeAccounting() {
      this.submitted = true
      const isValid = await this.v$.$validate()

      if (!isValid) {
        return
      }

      axios
        .post('/api/accounting', {
          date: this.$formatDate(this.date),
          'movement_type': this.selectedMovementType,
          'payment_type': this.selectedPaymentType,
          amount: this.amount,
          description: this.description,
        })
        .then(() => {
          this.resetForm()
          this.page = 1
          this.accounting = []
          this.hasMore = true
          this.showAccounting()
          this.$toast.success('Guardado correctamente', {
            timeout: 2000,
            closeOnClick: true,
            // pauseOnHover: true, hace que se pause el hover
            // draggable: true, hace que se pueda arrastrar el toast
            // maxToasts: 3, hace que se pueda mostrar un maximo de 3 toasts
            // newestOnTop: true, hace que se muestre el toast mas nuevo al principio
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    async showAccounting({ done } = {}) {
      if (!this.hasMore && done) {
        done('empty')

        return
      }

      try {
        const response = await axios.get('/api/accounting', {
          params: {
            page: this.page,
          },
        })

        const rows = response.data.data ?? []

        this.accounting = [...this.accounting, ...rows]

        const next = response.data.next_page_url

        if (next) {
          this.page += 1
          this.hasMore = true
        } else {
          this.hasMore = false
        }

        if (done)
          done(next ? 'ok' : 'empty')
      } catch (error) {
        console.log(error)
        if (done)
          done('error')
      }
    },
    resetForm() {
      this.date = new Date()
      this.selectedMovementType = null
      this.selectedPaymentType = null
      this.amount = ''
      this.description = ''
      this.submitted = false
      this.v$.$reset()
    },
    paymentTypeLabel(value) {
      const found = this.paymentTypes.find(p => p.value === value)

      return found ? found.title : value
    },
  },
}
</script>

<style scoped>
.accounting-table-card {
  border-color: rgba(var(--v-theme-on-surface), 0.08);
}

.accounting-table :deep(thead th) {
  position: sticky;
  top: 0;
  z-index: 1;
  box-shadow: 0 1px 0 rgba(var(--v-theme-on-surface), 0.08);
}

.accounting-table__th {
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.65) !important;
  background: rgb(var(--v-theme-surface)) !important;
  white-space: nowrap;
}

.accounting-table__th--narrow {
  width: 1%;
}

.accounting-table :deep(tbody tr:nth-child(even)) {
  background: rgba(var(--v-theme-on-surface), 0.02);
}

.accounting-table__num {
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum';
}

.accounting-mobile-list {
  max-height: min(400px, 55vh);
}

/* Anula el --v-field-padding-end reducido que pone .v-field--appended (suele ser ~6px) */
.monto-with-action :deep(.v-field.v-field--appended) {
  --v-field-padding-end: var(--v-field-padding-start, 16px);
}

/* Integra el botón en el campo sin cambiar variant/outline nativos de Vuetify */
.monto-with-action :deep(.v-field__field) {
  align-items: stretch;
}

.monto-with-action :deep(.v-field__append-inner) {
  align-self: stretch;
  align-items: stretch;
  padding-top: 0;
  padding-bottom: 0;
  padding-inline-start: 0;
  margin-inline-end: calc(-1 * var(--v-field-padding-end, 16px));
}

.monto-with-action__btn {
  align-self: stretch;
  min-width: 48px !important;
  height: auto !important;
  min-height: 100%;
  box-shadow: none !important;
  border-inline-start: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
