import { useGetProfileQuery } from '@app/api'
import { Typography } from '@shared/components'
import { NavLink } from 'react-router-dom'

import LogOutIcon from '@assets/icons/LogOutIcon'

import s from './user-info.module.scss'

export const UserInfo = () => {
  const { data: profile, isLoading } = useGetProfileQuery()
  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div className={s.userBlock}>
      <Typography variant="body_1" className={s.userName}>
        {profile?.first_name}
      </Typography>
      <Typography variant="body_1" className={s.userEmail}>
        {profile?.email}
      </Typography>
      <NavLink to={'/auth'} className={s.logOut}>
        <LogOutIcon width={'24px'} height={'24px'} />
        <Typography variant="caption">Выйти</Typography>
      </NavLink>
    </div>
  )
}
