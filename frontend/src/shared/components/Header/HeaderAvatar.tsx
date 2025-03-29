import { Typography } from '../typography'

import s from './header.module.scss'

export const HeaderAvatar = () => {
  return (
    <div className={s.headerAvatar}>
      <Typography variant="header_6">AC</Typography>
    </div>
  )
}