import { unref } from 'vue'

/**
 * Mensajes de error de un campo de Vuelidate solo después de marcar el intento de envío.
 * @param {import('@vuelidate/core').BaseValidation} field
 * @param {boolean} submitted
 * @returns {string[]}
 */
export function vuelidateSubmittedFieldMessages(field, submitted) {
  if (!submitted || !field.$invalid)
    return []

  return field.$errors.map(e => unref(e.$message))
}
