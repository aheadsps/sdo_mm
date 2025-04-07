import { useScreenWidth } from '@shared/hooks'
import { ComponentPropsWithoutRef, ReactNode } from 'react'

import { Input, Textarea } from '../text-field'

import s from './input-with-icon.module.scss'

type Props = {
  children?: ReactNode
  icon?: ReactNode
  className?: string
  isOpen?: boolean
  onClick: () => void
} & ComponentPropsWithoutRef<'input'>

export const InputWithIcon = ({
  children,
  className,
  placeholder,
  isOpen,
  icon,
  onClick,
}: Props) => {
  const { width } = useScreenWidth()
  return (
    <div className={s.inputBlock}>
      {width < 425 ? (
        <Textarea className={className} placeholder={placeholder} />
      ) : (
        <Input className={className} placeholder={placeholder} />
      )}
      <div className={s.icon} onClick={onClick}>
        {icon}
      </div>
      {isOpen && <div className={s.dropdown}>{children}</div>}
    </div>
  )
}
