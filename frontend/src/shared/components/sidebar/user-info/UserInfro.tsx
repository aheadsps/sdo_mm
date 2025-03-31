import { Typography } from '@shared/components'
import { NavLink } from 'react-router-dom'

import LogOutIcon from '@assets/icons/LogOutIcon'

import s from './user-info.module.scss'

export const UserInfo = () => {
  return (
    <div className={s.userBlock}>
      <Typography variant="body_1" className={s.userName}>
        Алена Сон
      </Typography>
      <Typography variant="body_1" className={s.userEmail}>
        as.alenason@gmail.com
      </Typography>
      <NavLink to={'/auth'} className={s.logOut}>
        <LogOutIcon width={'24px'} height={'24px'} />
        <Typography variant="caption">Выйти</Typography>
      </NavLink>
    </div>
  )
}
