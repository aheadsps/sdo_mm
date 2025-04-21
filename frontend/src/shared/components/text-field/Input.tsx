import clsx from 'clsx'
import { ComponentPropsWithRef, forwardRef } from 'react'

import s from './input.module.scss'

type Props = ComponentPropsWithRef<'input'>

export const Input = forwardRef<HTMLInputElement, Props>(({ className, ...restProps }, ref) => {
  return <input ref={ref} className={clsx(s.input, className)} {...restProps} />
})

Input.displayName = 'Input'
