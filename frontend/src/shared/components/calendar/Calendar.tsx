import { Typography } from '../typography'

import s from './calendar.module.scss'

export const Calendar = () => {
  return (
    <div className={s.calendar}>
      <Typography variant="body_1">Здесь будет календарь</Typography>
    </div>
  )
}
