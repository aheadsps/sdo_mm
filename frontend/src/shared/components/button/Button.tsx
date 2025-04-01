import clsx from 'clsx'
import { ComponentPropsWithRef, MouseEvent } from 'react'
import { ElementType } from 'react'

import s from './button.module.scss'

type Props<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary'
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  as?: T
} & ComponentPropsWithRef<T>

export const Button = <T extends ElementType = 'button'>({
  variant = 'primary',
  as: Component = 'button',
  className,
  children,
  ...restProps
}: Props<T>) => {
  const chosenButton = variant === 'secondary' ? s.secondary : s.primary
  return (
    <Component className={clsx(s.button, chosenButton, className as string)} {...restProps}>
      {children}
    </Component>
  )
}

Button.displayName = 'Button'
