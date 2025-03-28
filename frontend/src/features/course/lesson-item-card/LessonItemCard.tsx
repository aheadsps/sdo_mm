import { ArrowUpRightIcon } from '@assets/icons'
import { Typography } from '@shared/components'
import { ComponentPropsWithoutRef } from 'react'

import { LessonItemTitle } from '../lesson-item-title/LessonItemTitle'

import s from './lesson-item-card.module.scss'

type Props = ComponentPropsWithoutRef<'div'>

export const LessonItemCard = ({ children }: Props) => {
  return (
    <div className={s.lessonItemCard}>
      <LessonItemTitle title="Урок 1. Проверка стартового уровня" blocks="2 блока">
        <ArrowUpRightIcon className={s.icon} />
      </LessonItemTitle>
      <Typography variant="caption" className={s.lessonProgress}>
        Прогресс: <span className={s.lessonProgressSuccess}>100%</span>
      </Typography>
      {children}
    </div>
  )
}
