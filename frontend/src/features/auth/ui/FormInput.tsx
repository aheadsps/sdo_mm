import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

import s from './form-input.module.scss'

import { Input } from '@/shared/components'

type Props<T extends FieldValues> = {
  children?: ReactNode
  name: Path<T>
  control: Control<T>
} & ComponentPropsWithoutRef<typeof Input>
export const FormInput = <T extends FieldValues>({
  children,
  name,
  control,
  ...props
}: Props<T>) => {
  const {
    field,
    fieldState: { error },
  } = useController({ name, control })
  return (
    <div className={s.inputBlock}>
      <Input
        className={`${s.authInput} ${error ? s.inputError : ''}`}
        required
        {...field}
        {...props}
      />
      {error && <span className={s.error}>{error.message}</span>}
      {children}
    </div>
  )
}
