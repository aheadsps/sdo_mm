import clsx from 'clsx'
import { ComponentPropsWithoutRef } from 'react'

import s from './card.module.scss'

type Props = ComponentPropsWithoutRef<'div'>
export const Card = ({ className, children }: Props) => {
  return <div className={clsx(s.card, className)}>{children}</div>
}
