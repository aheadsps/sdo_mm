import { ArrowRightIcon } from '@assets/icons'
import { getBackgroundColor } from '@shared/utils'
import clsx from 'clsx'
import { ComponentPropsWithRef, ReactNode } from 'react'

import { Typography } from '../typography'

import s from './task.module.scss'

type Props = {
  daysLeft?: number
  children: ReactNode
} & ComponentPropsWithRef<'div'>

export const Task = ({ daysLeft, children, className }: Props) => {
  return (
    <div className={clsx(s.card, className)}>
      <span className={s.leftBar} style={{ backgroundColor: getBackgroundColor(daysLeft) }}></span>
      <div className={s.content}>
        <Typography variant="body_1" className={s.title}>
          {children}
        </Typography>
        <ArrowRightIcon width={'8px'} height={'14px'} className={s.icon} />
      </div>
      {daysLeft !== undefined && daysLeft > 0 && (
        <Typography variant="caption" className={s.subtitle}>
          Осталось {daysLeft} дня
        </Typography>
      )}
      {daysLeft !== undefined && daysLeft <= 0 && (
        <Typography variant="caption" className={s.subtitle}>
          Просрочен
        </Typography>
      )}
    </div>
  )
}