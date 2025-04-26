import { routes } from '@routes/routes'
import { getToken } from '@services/api'
import { Role } from '@shared/components/sidebar/sidebar.types'
import { Navigate, Outlet } from 'react-router-dom'

type ProtectedRouteProps = {
  allowedRoles?: number
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const isAuth = !!getToken()
  const userRole = Number(localStorage.getItem('role'))

  if (!isAuth) {
    return <Navigate to={routes.auth} replace />
  }

  if (allowedRoles !== undefined && userRole !== allowedRoles) {
    const fallbackRoute = userRole === Role.methodologist ? routes.trainingCenter : routes.main

    return <Navigate to={fallbackRoute} replace />
  }

  return <Outlet />
}
