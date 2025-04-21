import DeleteIcon from '@assets/icons/DeleteIcon'
import DoubleIcon from '@assets/icons/DoubleIcon'
import DragIcon from '@assets/icons/DragIcon'
import PlusIcon from '@assets/icons/PlusIcon'
import React from 'react'

import { Typography } from '../typography'

import s from './cardActionsBar.module.scss'

interface Props {
  description?: string
  deleteItem: () => void
}

export const CardActionsBar: React.FC<Props> = ({ description, deleteItem }) => {
  return (
    <div className={s.bar}>
      <div className={s.desc}>
        {description && (
          <Typography variant="caption" className={s.label}>
            {description}
          </Typography>
        )}
      </div>

      <div className={s.actions}>
        <button className={s.btn} title="Добавить">
          <PlusIcon />
        </button>
        <button className={s.btn} title="Дублировать">
          <DoubleIcon />
        </button>
        <button className={s.btn} title="Удалить" onClick={deleteItem}>
          <DeleteIcon />
        </button>
        <button className={s.btn} title="Перетащить">
          <DragIcon />
        </button>
      </div>
    </div>
  )
}
