import { LockIcon } from '@assets/icons'
import clsx from 'clsx'
import { ComponentPropsWithRef, MouseEvent } from 'react'
import { ElementType } from 'react'
import { NavLink } from 'react-router-dom'

import s from './button.module.scss'

type Props<T extends ElementType = 'button'> = {
  variant?: 'primary' | 'secondary'
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  as?: T
  disabled?: boolean
  isIcon?: boolean
} & ComponentPropsWithRef<T>

export const Button = <T extends ElementType = 'button'>({
  variant = 'primary',
  as: Component = 'button',
  className,
  children,
  disabled = false,
  onClick,
  isIcon = false,
  ...restProps
}: Props<T>) => {
  const chosenButton = variant === 'secondary' ? s.secondary : s.primary
  const isButton = Component === 'button'
  const isLink = Component === NavLink
  const disabledLink = variant === 'secondary' ? s.disabledSecondary : s.disabledPrimary

  return (
    <Component
      className={clsx(s.button, chosenButton, className, isLink && disabled && disabledLink)}
      onClick={onClick}
      {...(isButton && { disabled })}
      {...restProps}
    >
      <span className={s.buttonsSpan}>
        {children}
        {disabled && isIcon && (
          <LockIcon stroke="var(--color-text-secondary)" width={'12px'} height={'12px'} />
        )}
      </span>
    </Component>
  )
}

Button.displayName = 'Button'
