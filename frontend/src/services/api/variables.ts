export const baseUrl = 'http://localhost:8080/api/v1'
// export const baseUrl = `https://${location.hostname}/api/v1`

export const getToken = () => {
  const token = localStorage.getItem('token')
  if (!token) return
  return token
}
