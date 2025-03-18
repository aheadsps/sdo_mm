import clsx from 'clsx'
import { ComponentPropsWithRef, ElementType, forwardRef } from 'react'

import s from './input.module.scss'

type Props<T extends ElementType = 'input'> = {
  variant?: 'primary' | 'secondary'
  as?: T
} & ComponentPropsWithRef<T>

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ variant = 'primary', as: Component = 'input', className, ...restProps }, ref) => {
    const chosenInput = variant === 'secondary' ? s.secondary : s.primary

    return (
      <Component
        ref={ref}
        className={clsx(s.input, chosenInput, className as string)}
        {...restProps}
      />
    )
  }
)

Input.displayName = 'Input'
