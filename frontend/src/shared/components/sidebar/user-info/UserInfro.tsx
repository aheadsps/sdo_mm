import { LogOutIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useGetProfileQuery } from '@services/auth'
import { clearUser, setUser } from '@services/auth/authSlice'
import { useAppDispatch } from '@services/store'
import { handleError } from '@shared/utils'
import { useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { Typography } from '../../typography'

import s from './user-info.module.scss'

export const UserInfo = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile))
    }
  }, [dispatch, profile])

  const onLogout = () => {
    dispatch(clearUser())
    navigate(routes.auth, { replace: true })
  }

  if (isLoading) {
    return <div>Loading...</div>
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
    </div>
  )
}
