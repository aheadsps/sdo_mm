import { LogOutIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { ProfileResponse, useLogoutMutation } from '@services/api'
import { clearUser } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { handleError } from '@shared/utils'
import { NavLink, useNavigate } from 'react-router-dom'

import { Typography } from '../../typography'

import s from './user-info.module.scss'

type Props = {
  profile: ProfileResponse
}
export const UserInfo = ({ profile }: Props) => {
  const [logout, { error: logoutError }] = useLogoutMutation()

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    await logout().unwrap()
    dispatch(clearUser())
    localStorage.removeItem('role')
    navigate(routes.auth, { replace: true })
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
      {logoutError && <Typography variant="body_1">{handleError(logoutError)}</Typography>}
    </div>
  )
}
