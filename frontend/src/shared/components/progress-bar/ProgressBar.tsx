import { calculateProgress } from '@shared/utils'
import clsx from 'clsx'
import { CSSProperties } from 'react'

import s from './progress-bar.module.scss'

type Props = {
  progress: number
  total: number
  progressBarClassName?: string
  progressIndicatorClassName?: string
  progressBarStyle?: CSSProperties
  progressIndicatorStyle?: CSSProperties
}
export const ProgressBar = ({
  progress,
  total,
  progressBarClassName,
  progressIndicatorClassName,
}: Props) => {
  const progressPercentage = calculateProgress(progress, total)
  return (
    <div className={clsx(s.progressBar, progressBarClassName)}>
      <div
        className={clsx(s.progressBarIndicator, progressIndicatorClassName)}
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  )
}
