export const getUserInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName[0].toUpperCase()
  const secondInitial = lastName[0].toUpperCase()
  return `${firstInitial}${secondInitial}`
}
