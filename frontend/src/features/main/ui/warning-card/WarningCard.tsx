import { Event } from '@services/events'
import { Typography, Button } from '@shared/components'
import { formatDate, getDaysLeft } from '@shared/utils'

import s from './warning-card.module.scss'

type Props = {
  expiringEvents: Event[] | undefined
}

export const WarningCard = ({ expiringEvents }: Props) => {
  if (!expiringEvents || expiringEvents.length === 0) {
    return null
  }
  return expiringEvents.map((result) => (
    <div className={s.warningCard} key={result.id}>
      <Typography variant="header_6" className={s.warningIndicator}>
        Время на прохождение истекает!
      </Typography>

      <div className={s.textBlock}>
        <Typography variant="body_1" className={s.text}>
          {result.course.name}
        </Typography>
        <Typography variant="caption" className={s.caption}>
          {`Остался ${getDaysLeft(result.end_date)} день, пройдите до ${formatDate(result.end_date)}`}
        </Typography>
        <Button type="button" className={s.button}>
          Перейти к инструктажу
        </Button>
      </div>
    </div>
  ))
}
