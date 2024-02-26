export function formatDateDefaultReport(date: string) {
  return date.split('/').reverse().join('-')
}
