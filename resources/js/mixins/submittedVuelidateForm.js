import { vuelidateSubmittedFieldMessages } from '@/utils/vuelidateSubmittedFieldMessages'

/**
 * Options API: añade `submitted` y el método `errors(field)` para formularios con Vuelidate.
 * En el submit: `this.submitted = true` y luego `await this.v$.$validate()`.
 */
export default {
  data() {
    return {
      submitted: false,
    }
  },

  methods: {
    errors(field) {
      return vuelidateSubmittedFieldMessages(field, this.submitted)
    },
  },
}
