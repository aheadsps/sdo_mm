import { Card } from '@shared/components/card'
import React from 'react'

import { CardActionsBar } from '../cardActionsBar'
import { Input } from '../text-field'

import s from './constructorCard.module.scss'

interface Props {
  children: React.ReactNode
  deleteItem: () => void
}

export const ConstructorCard: React.FC<Props> = ({ children, deleteItem }) => {
  return (
    <Card className={s.wrapper}>
      <div className={s.inputBlock}>
        <Input placeholder="Описание (не обязательно)" />
        <CardActionsBar deleteItem={deleteItem} />
      </div>
      {children}
    </Card>
  )
}
