import { LogOutIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useGetProfileQuery, useLogoutMutation } from '@services/api'
import { clearUser, setUser } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { Loader } from '@shared/components/loader'
import { handleError } from '@shared/utils'
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Typography } from '../../typography'

import s from './user-info.module.scss'

export const UserInfo = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery()
  const [logout, { error: logoutError }] = useLogoutMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile))
    }
  }, [dispatch, profile])

  const onLogout = async () => {
    await logout().unwrap()
    dispatch(clearUser())
    navigate(routes.auth, { replace: true })
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={s.userBlock}>
      <Typography variant="body_1" className={s.userName}>
        {profile?.first_name} {profile?.last_name}
      </Typography>
      <Typography variant="body_1" className={s.userEmail}>
        {profile?.email}
      </Typography>
      {error && <Typography variant="body_1">{handleError(error)}</Typography>}
      <NavLink to={routes.auth} className={s.logOut} onClick={onLogout}>
        <LogOutIcon width={'24px'} height={'24px'} />
        <Typography variant="caption">Выйти</Typography>
      </NavLink>
      {logoutError && <Typography variant="body_1">{handleError(logoutError)}</Typography>}
    </div>
  )
}
