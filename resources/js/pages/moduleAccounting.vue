<template>
  <VForm>
    <VContainer>
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.firstname.$model"
            label="First name"
            :error-messages="errors(v$.firstname)"
          />
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.lastname.$model"
            label="Last name"
            :error-messages="errors(v$.lastname)"
          />
        </VCol>

        <VCol
          cols="12"
          md="4"
        >
          <VTextField
            v-model="v$.email.$model"
            label="E-mail"
            :error-messages="errors(v$.email)"
          />
        </VCol>
      </VRow>

      <VRow>
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
import { email, maxLength, required } from '@vuelidate/validators'

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
      firstname: '',
      lastname: '',
      email: '',
    }
  },

  validations() {
    return {
      firstname: {
        required: { $validator: required, $message: 'First name is required' },
        maxLength: { $validator: maxLength(10), $message: 'Max 10 characters' },
      },
      lastname: {
        required: { $validator: required, $message: 'Last name is required' },
      },
      email: {
        required: { $validator: required, $message: 'Email is required' },
        email: { $validator: email, $message: 'Invalid email' },
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
