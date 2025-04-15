import { ArrowUpRightIcon } from '@assets/icons'
import { Lesson } from '@services/api'
import { Typography } from '@shared/components'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { LessonItemTitle } from '../lesson-item-title/LessonItemTitle'

import s from './lesson-item-card.module.scss'

type Props = {
  lesson: Lesson
  children?: ReactNode
} & ComponentPropsWithoutRef<'div'>

export const LessonItemCard = ({ children, lesson }: Props) => {
  console.log(lesson)
  return (
    <div className={s.lessonItemCard}>
      <LessonItemTitle title={lesson.name} blocks="2 блока">
        <ArrowUpRightIcon className={s.icon} />
      </LessonItemTitle>
      <Typography variant="caption" className={s.lessonProgress}>
        Прогресс:{' '}
        <span className={s.lessonProgressSuccess}>{Math.floor(Math.random() * 100) + 1} %</span>
      </Typography>
      {children}
    </div>
    // <div className={s.lessonItemCard}>
    //   <LessonItemTitle title="Урок 1. Проверка стартового уровня" blocks="2 блока">
    //     <ArrowUpRightIcon className={s.icon} />
    //   </LessonItemTitle>
    //   <Typography variant="caption" className={s.lessonProgress}>
    //     Прогресс: <span className={s.lessonProgressSuccess}>100%</span>
    //   </Typography>
    //   {children}
    // </div>
  )
}
