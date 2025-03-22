import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'
import { ComponentPropsWithRef } from 'react'

import s from './button.module.scss'

type Props = {
  variant?: 'primary' | 'secondary'
  asChild?: boolean
} & ComponentPropsWithRef<'button'>

export const Button = ({ asChild, disabled, className, variant = 'primary', ...props }: Props) => {
  const Component = asChild ? Slot : 'button'
  const chosenButton = variant === 'secondary' ? s.secondary : s.primary
  return (
    <Component
      className={clsx(s.button, chosenButton, className as string, disabled && s.disabled)}
      disabled={disabled}
      {...props}
    />
  )
}

Button.displayName = 'Button'
