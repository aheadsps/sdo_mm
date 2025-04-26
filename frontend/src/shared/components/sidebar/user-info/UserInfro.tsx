import { LogOutIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useLogoutMutation } from '@services/api'
import { useGetProfileQuery } from '@services/api'
import { clearUser } from '@services/slices'
import { setUser } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { handleError } from '@shared/utils'
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Loader } from 'rsuite'

import { Typography } from '../../typography'

import s from './user-info.module.scss'

export const UserInfo = () => {
  const [logout, { error: logoutError }] = useLogoutMutation()

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetProfileQuery()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (profile) {
      localStorage.setItem('role', JSON.stringify(profile.profession))
      dispatch(setUser(profile))
    }
  }, [dispatch, profile])

  const navigate = useNavigate()

  const onLogout = async () => {
    await logout().unwrap()
    dispatch(clearUser())
    localStorage.removeItem('role')
    navigate(routes.auth, { replace: true })
  }

  if (isProfileLoading) {
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
      <NavLink to={routes.auth} className={s.logOut} onClick={onLogout}>
        <LogOutIcon width={'24px'} height={'24px'} />
        <Typography variant="caption">Выйти</Typography>
      </NavLink>
      {profileError && <Typography variant="body_1">{handleError(profileError)}</Typography>}
      {logoutError && <Typography variant="body_1">{handleError(logoutError)}</Typography>}
    </div>
  )
}
