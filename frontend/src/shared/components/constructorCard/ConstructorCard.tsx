import { Card } from '@shared/components/card'
import React from 'react'

import { CardActionsBar } from '../cardActionsBar'
import { Input } from '../text-field'

import s from './constructorCard.module.scss'

interface Props {
  children: React.ReactNode
}

export const ConstructorCard: React.FC<Props> = ({ children }) => {
  return (
    <Card className={s.wrapper}>
      <div className={s.inputBlock}>
        <Input placeholder="Описание (не обязательно)" />
        <CardActionsBar />
      </div>
      {children}
    </Card>
  )
}
