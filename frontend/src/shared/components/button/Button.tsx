import clsx from 'clsx'
import { ComponentPropsWithRef } from 'react'
import { ElementType } from 'react'

import s from './button.module.scss'

type Props<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary'
  as?: T
} & ComponentPropsWithRef<T>

export const Button = <T extends ElementType = 'button'>({
  variant,
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
