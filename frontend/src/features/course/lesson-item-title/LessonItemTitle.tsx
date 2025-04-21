import { Typography } from '@shared/components'
import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

import s from './lesson-item-title.module.scss'

type Props = ComponentPropsWithoutRef<'div'> & {
  title: string
  blocks?: string
}

export const LessonItemTitle = ({ children, className, title, blocks }: Props) => {
  return (
    <>
      <div className={s.lessonItem}>
        <Typography variant="body_1" className={clsx(s.lessonItemTitle, className)}>
          {title}
        </Typography>
        {children}
      </div>
      <Typography variant="caption" className={s.caption}>
        {blocks}
      </Typography>
    </>
  )
}
