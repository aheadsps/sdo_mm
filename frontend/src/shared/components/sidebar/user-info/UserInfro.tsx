import { NavLink } from 'react-router-dom'

import { Typography } from '../../typography'

import s from './user-info.module.scss'

import { LogOutIcon } from '@/assets/icons'
import { useGetProfileQuery } from '@/services'
import { handleError } from '@/shared/utils'

export const UserInfo = () => {
  const { data: profile, isLoading, error } = useGetProfileQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className={s.userBlock}>
      <Typography variant="body_1" className={s.userName}>
        {profile?.first_name}
      </Typography>
      <Typography variant="body_1" className={s.userEmail}>
        {profile?.email}
      </Typography>
      {error && <Typography variant="body_1">{handleError(error)}</Typography>}
      <NavLink to={'/auth'} className={s.logOut}>
        <LogOutIcon width={'24px'} height={'24px'} />
        <Typography variant="caption">Выйти</Typography>
      </NavLink>
    </div>
  )
}
