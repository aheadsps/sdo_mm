import { AddItemIcon, ButtonIcon } from '@assets/icons'
import { ComponentPropsWithRef, ElementType } from 'react'

import s from './addCard.module.scss'

type Props<T extends ElementType = 'p'> = {
  children: string
  onClick?: () => void
  key?: number
  as?: T
} & ComponentPropsWithRef<T>

export const AddCard = <T extends ElementType = 'p'>({ children, onClick }: Props<T>) => {
  return (
    <div className={s.card} onClick={onClick}>
      <ButtonIcon />
      <p className={s.title}>{children}</p>
      <AddItemIcon />
    </div>
  )
}
