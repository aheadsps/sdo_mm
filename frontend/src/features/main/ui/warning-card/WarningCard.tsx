import s from './warning-card.module.scss'

import { Typography, Button } from '@/shared/components'

export const WarningCard = () => {
  return (
    <div className={s.warningCard}>
      <Typography variant="header_6" className={s.warningIndicator}>
        Время на прохождение истекает!
      </Typography>

      <div className={s.textBlock}>
        <Typography variant="body_1" className={s.text}>
          Работа с опасными веществами
        </Typography>
        <Typography variant="caption" className={s.caption}>
          Остался 1 день, пройдите до 12.03.2025
        </Typography>
        <Button type="button" className={s.button}>
          Перейти к инструктажу
        </Button>
      </div>
    </div>
  )
}
