export const getDeadlineStatus = (days: number): string => {
  if (days < 0) {
    return 'Просрочен'
  }
  const lastDigit = days % 10
  const lastTwoDigits = days % 100

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${days} дней`
  }
  if (lastDigit === 1) {
    return `${days} день`
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return `${days} дня`
  }
  return `${days} дней`
}
