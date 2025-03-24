import clsx from 'clsx'
import { ComponentPropsWithRef, forwardRef } from 'react'

import s from './input.module.scss'

type Props = ComponentPropsWithRef<'textarea'>

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, ...restProps }, ref) => {
    return <textarea ref={ref} className={clsx(s.input, className)} {...restProps} />
  }
)

Textarea.displayName = 'Textarea'
