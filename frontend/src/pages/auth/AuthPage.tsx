import { AuthForm } from '@features/auth'
import { routes } from '@routes/routes'
import { getToken } from '@services/api'
import { ImageComponent, Header } from '@shared/components'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import styles from './authpage.module.scss'

export const AuthPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isAuth = !!getToken()

  useEffect(() => {
    if (isAuth) {
      const back = location.state?.from || routes.main
      navigate(back, { replace: true })
    }
  }, [isAuth, location, navigate])

  if (isAuth) return null
  return (
    <div className={styles.authPage__container}>
      <Header />
      <AuthForm />
      <ImageComponent className={styles.authPage__image} src="/img/img_tmp/bg_trains.png" />
    </div>
  )
}
