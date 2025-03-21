import { Typography } from '@shared/components'
import { ComponentPropsWithoutRef } from 'react'

import { ArrowUpRightIcon } from '@assets/icons'

import s from './lesson-item-card.module.scss'

type Props = ComponentPropsWithoutRef<'div'>

export const LessonItemCard = ({ children }: Props) => {
  return (
    <div className={s.lessonItemCard}>
      <div className={s.lessonItem}>
        <Typography variant="body_1" className={s.lessonItemTitle}>
          Урок 1. Проверка стартового уровня
        </Typography>
        <ArrowUpRightIcon className={s.icon} />
      </div>
      <Typography variant="caption" className={s.caption}>
        2 блока
      </Typography>
      <Typography variant="caption" className={s.lessonProgress}>
        Прогресс: <span className={s.lessonProgressSuccess}>100%</span>
      </Typography>
      {children}
    </div>
  )
}
