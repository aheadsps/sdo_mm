import clsx from 'clsx'
import { ComponentPropsWithRef } from 'react'

import s from './button.module.scss'

type Props = {
  variant?: 'primary' | 'secondary'
} & ComponentPropsWithRef<'button'>

export const Button = ({ children, className, variant = 'primary' }: Props) => {
  const chosenButton = variant === 'secondary' ? s.secondary : s.primary
  return <button className={clsx(s.button, chosenButton, className)}>{children}</button>
}
