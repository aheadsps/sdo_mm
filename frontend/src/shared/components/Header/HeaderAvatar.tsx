import { Typography } from '../typography'

import s from './header.module.scss'

import { useAppSelector } from '@/services'
import { selectUser } from '@/services/auth'
import { getUserInitials } from '@/shared/utils'

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
