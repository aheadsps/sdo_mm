import React from 'react'
import s from './cardActionsBar.module.scss'
import PlusIcon from '@assets/icons/PlusIcon'
import DoubleIcon from '@assets/icons/DoubleIcon'
import DeleteIcon from '@assets/icons/DeleteIcon'
import DragIcon from '@assets/icons/DragIcon'
import { Typography } from '../typography'

interface Props {
  description?: string
}

export const CardActionsBar: React.FC<Props> = ({ description }) => {
  return (
    
    <div className={s.bar}>
       <div className={s.desc}>
      {description && (
        <Typography variant="caption" className={s.label}>
          {description}
        </Typography>
        
      )}</div>

      <div className={s.actions}>
        <button className={s.btn} title="Добавить">
          <PlusIcon />
        </button>
        <button className={s.btn} title="Дублировать">
          <DoubleIcon />
        </button>
        <button className={s.btn} title="Удалить">
          <DeleteIcon />
        </button>
        <button className={s.btn} title="Перетащить">
          <DragIcon />
        </button>
        </div>

    </div>
    
  )
}
