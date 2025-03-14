import { Typography } from '@shared/components'

import ArrowRightIcon from '@assets/icons/ArrowRightIcon'

import s from './task.module.scss'

type Props = {
  daysLeft?: number
}
export const Task = ({ daysLeft }: Props) => {
  const getBackgroundColor = (days?: number) => {
    if (!days) return 'var(--color-accent-info)'
    if (days < 3) return 'var(--color-accent-negative)'
    if (days >= 3 && days <= 6) return 'var(--color-accent-orange)'
    if (days >= 7) return 'var(--color-accent-success)'
  }

  return (
    <div className={s.card}>
      <span className={s.leftBar} style={{ backgroundColor: getBackgroundColor(daysLeft) }}></span>
      <div className={s.content}>
        <Typography variant="body_1" className={s.title}>
          Охрана труда
        </Typography>
        <ArrowRightIcon width={'8px'} height={'14px'} className={s.icon} />
      </div>
      {daysLeft && (
        <Typography variant="caption" className={s.subtitle}>
          Осталось {daysLeft} дня
        </Typography>
      )}
    </div>
  )
}
