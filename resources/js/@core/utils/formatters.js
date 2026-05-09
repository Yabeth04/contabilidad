// TODO: Try to implement this: https://twitter.com/fireship_dev/status/1565424801216311297
export const kFormatter = num => {
  const regex = /\B(?=(\d{3})+(?!\d))/g

  return Math.abs(num) > 9999 ? `${Math.sign(num) * +((Math.abs(num) / 1000).toFixed(1))}k` : Math.abs(num).toFixed(0).replace(regex, ',')
}

/**
 * Fecha en calendario local como YYYY-MM-DD (adecuado para inputs tipo date y APIs).
 * Evita el desfase de día que suele dar solo `toISOString().split('T')[0]` (UTC).
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {string|null}
 */
export const formatDate = value => {
  if (value == null || value === '')
    return null

  const d = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(d.getTime()))
    return null

  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${y}-${m}-${day}`
}

/**
 * Monto para UI: separadores en español y 2 decimales; inválidos → '—'.
 *
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export const formatAmount = value => {
  if (value == null || value === '')
    return '—'

  const n = Number(value)

  if (Number.isNaN(n))
    return '—'

  return n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
