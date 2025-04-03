import { useScreenWidth } from '@shared/hooks'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Input, Textarea } from '../text-field'

import s from './form-input.module.scss'

type Props = {
  children?: ReactNode
  className?: string
} & ComponentPropsWithoutRef<'input'>

export const FormInput = ({ children, className, placeholder }: Props) => {
  const { width } = useScreenWidth()
  return (
    <div className={s.inputBlock}>
      {width < 400 ? (
        <Textarea className={className} placeholder={placeholder} />
      ) : (
        <Input className={className} placeholder={placeholder} />
      )}
      {children}
    </div>
  )
}
