import { routes } from '@routes/routes'
import { selectExpiringCovers } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Typography, Button } from '@shared/components'
import { formatDate, getDaysLeft } from '@shared/utils'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import s from './warning-card.module.scss'

type Props = {
  className?: string
}
export const WarningCard = ({ className }: Props) => {
  const expiringEvents = useAppSelector(selectExpiringCovers)
  if (!expiringEvents || expiringEvents.length === 0) {
    return null
  }
  return expiringEvents.map((result) => (
    <div className={clsx(s.warningCard, className)} key={result.event.course.id}>
      <Typography variant="header_6" className={s.warningIndicator}>
        Время на прохождение истекает!
      </Typography>

      <div className={s.textBlock}>
        <Typography variant="body_1" className={s.text}>
          {result.event.course.name}
        </Typography>
        <Typography variant="caption" className={s.caption}>
          {`Остался ${getDaysLeft(result.event.end_date)} день, пройдите до ${formatDate(result.event.end_date)}`}
        </Typography>
        <Button type="button" className={s.button} as={NavLink} to={routes.course}>
          Перейти к инструктажу
        </Button>
      </div>
    </div>
  ))
}
