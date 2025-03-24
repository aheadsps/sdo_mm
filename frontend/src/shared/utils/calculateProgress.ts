export const calculateProgress = (current: number, total: number) => {
  if (total === 0) return 0
  return Math.min(Math.max((current / total) * 100, 0), 100)
}
