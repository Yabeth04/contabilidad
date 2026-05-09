<template>
  <VForm>
    <VContainer>
      <VRow>
        <!-- Fecha -->
        <VCol
          cols="12"
          md="4"
        >
          <VMenu
            v-model="menu"
            :close-on-content-click="false"
            location="bottom start"
          >
            <template #activator="{ props: menuProps }">
              <VTextField
                v-bind="menuProps"
                v-model="date"
                label="Fecha"
                variant="outlined"
                rounded="lg"
                readonly
                append-inner-icon="ri-calendar-line"
                :error-messages="errors(v$.date)"
                required
              />
            </template>
            <VDatePicker
              v-model="date"
              show-adjacent-months
              @update:model-value="menu = false"
            />
          </VMenu>
        </VCol>

        <!-- Last name -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.lastname.$model"
            label="Last name"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.lastname)"
          />
        </VCol>

        <!-- E-mail -->
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.email.$model"
            label="E-mail"
            variant="outlined"
            rounded="lg"
            :error-messages="errors(v$.email)"
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
import { email, helpers, required } from '@vuelidate/validators'

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
      menu: false,
      date: null,
      lastname: '',
      email: '',
    }
  },

  validations() {
    return {
      date: {
        required: helpers.withMessage('Fecha es requerida', required),
      },
      lastname: {
        required: helpers.withMessage('El nombre es requerido', required),
      },
      email: {
        required: helpers.withMessage('El email es requerido', required),
        email: helpers.withMessage('Email inválido', email),
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
