export const getBackgroundColor = (days?: number) => {
  if (days === undefined) return 'var(--color-accent-info)'
  if (days < 3) return 'var(--color-accent-negative)'
  if (days >= 3 && days <= 6) return 'var(--color-accent-orange)'
  if (days >= 7) return 'var(--color-accent-success)'
}