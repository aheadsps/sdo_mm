import React from 'react'
import { Card } from '@shared/components/card'
import s from './constructorCard.module.scss'

interface Props {
  children: React.ReactNode
}

export const ConstructorCard: React.FC<Props> = ({ children }) => {
  return (
    <Card className={s.wrapper}>
      {children}
    </Card>
  )
}
