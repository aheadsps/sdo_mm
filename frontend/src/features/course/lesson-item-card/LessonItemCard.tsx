import { Typography } from '@shared/components'

import s from './lesson-item-card.module.scss'

export const LessonItemCard = () => {
  return (
    <div className={s.lessonItemCard}>
      <Typography variant="body_1" className={s.lessonItemTitle}>
        Урок 1. Проверка стартового уровня
      </Typography>
      <Typography variant="caption" className={s.caption}>
        2 блока
      </Typography>
      <Typography variant="caption" className={s.lessonProgress}>
        Прогресс: <span className={s.lessonProgressSuccess}>100%</span>
      </Typography>
    </div>
  )
}
