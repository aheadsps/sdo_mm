import { selectUser } from '@services/auth'
import { useAppSelector } from '@services/store'
import { getUserInitials } from '@shared/utils'

import { Typography } from '../typography'

import s from './header.module.scss'

export const HeaderAvatar = () => {
  const user = useAppSelector(selectUser)
  return (
    user && (
      <div className={s.headerAvatar}>
        <Typography variant="header_6">
          {getUserInitials(user?.first_name, user?.last_name)}
        </Typography>
      </div>
    )
  )
}
