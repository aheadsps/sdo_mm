export const getDaysLeft = (endDateString: string): number => {
  const now = new Date()
  const endDate = new Date(endDateString)

  const diffInMs = endDate.getTime() - now.getTime()
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24))
}
