import { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'input'>

import s from './input-radio.module.scss'

export const InputRadio = ({ checked, disabled, onChange, type = 'radio', ...props }: Props) => {
  return (
    <input
      type={type}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={s.input}
      {...props}
    />
  )
}
