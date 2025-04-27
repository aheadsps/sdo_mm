import { ArrowUpRightIcon } from '@assets/icons'
import { Lesson } from '@services/api'
import { Typography } from '@shared/components'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { LessonItemTitle } from '../lesson-item-title/LessonItemTitle'

import s from './lesson-item-card.module.scss'

type Props = {
  lesson: Lesson
  children?: ReactNode
  onClick?: (arg1: string, arg2: string, arg3: boolean) => void
} & ComponentPropsWithoutRef<'div'>

export const LessonItemCard = ({ children, lesson, onClick }: Props) => {
  // console.log(lesson)
  return (
    <div className={s.lessonItemCard} onClick={onClick}>
      <LessonItemTitle title={lesson.name} blocks={`${lesson.serial} блок`}>
        <ArrowUpRightIcon className={s.icon} />
      </LessonItemTitle>
      <Typography variant="caption" className={s.lessonProgress}>
        Прогресс: <span className={s.lessonProgressSuccess}>120 %</span>
      </Typography>
      {children}
    </div>
  )
}
