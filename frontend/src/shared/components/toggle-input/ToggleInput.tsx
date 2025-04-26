import clsx from 'clsx'
import { ReactNode } from 'react'

import { Typography } from '../typography'

import s from './toggle-input.module.scss'

type Props = {
  className?: string
  children: ReactNode
  setEnabled: (enabled: boolean) => void
  enabled: boolean
}
export const ToggleInput = ({ className, children, setEnabled, enabled }: Props) => {
  const toggleEnabled = () => {
    setEnabled(!enabled)
  }
  return (
    <div className={clsx(s.toggleWrapper, className)}>
      <label className={s.switch}>
        <input type="checkbox" checked={enabled} onChange={toggleEnabled} />
        <span className={s.slider}></span>
      </label>
      <Typography variant="body_2">{children}</Typography>
    </div>
  )
}
