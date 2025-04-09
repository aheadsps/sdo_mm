import { routes } from '@routes/routes'
import { getToken } from '@services/api'
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const isAuth = !!getToken()

  return isAuth ? <Outlet /> : <Navigate to={routes.auth} replace />
}
