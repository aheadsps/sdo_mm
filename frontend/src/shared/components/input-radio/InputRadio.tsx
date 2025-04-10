import { ComponentPropsWithoutRef } from 'react'

type Props = ComponentPropsWithoutRef<'input'>

export const InputRadio = ({ checked, disabled, onChange, ...props }: Props) => {
  return <input type="radio" checked={checked} onChange={onChange} disabled={disabled} {...props} />
}
