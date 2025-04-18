import { routes } from '@routes/routes'
import { getToken } from '@services/api'
import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
  allowedRoles?: number
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const isAuth = !!getToken()
  const userRole = localStorage.getItem('role')

  if (!isAuth) {
    return <Navigate to={routes.auth} replace />
  }

  if (allowedRoles !== undefined && Number(userRole) !== allowedRoles) {
    return <Navigate to={routes.main} replace />
  }

  return <Outlet />
}
