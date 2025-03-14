import { Typography } from '@shared/components'
import { ReactNode } from 'react'

import ArrowRightIcon from '@assets/icons/ArrowRightIcon'

import s from './task.module.scss'

type Props = {
  daysLeft?: number
  children: ReactNode
}
export const Task = ({ daysLeft, children }: Props) => {
  const getBackgroundColor = (days?: number) => {
    if (days === undefined) return 'var(--color-accent-info)'
    if (days < 3) return 'var(--color-accent-negative)'
    if (days >= 3 && days <= 6) return 'var(--color-accent-orange)'
    if (days >= 7) return 'var(--color-accent-success)'
  }

  return (
    <div className={s.card}>
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
