import { Typography } from '@shared/components'
import clsx from 'clsx'

import s from './block-header.module.scss'

type Props = {
  columns: string[]
  className?: string
}
export const BlockHeader = ({ columns, className }: Props) => {
  return (
    <div className={clsx(s.header, className)}>
      {columns.map((column, index) => (
        <div key={index} className={s.headerItem}>
          <Typography variant="body_1">{column}</Typography>
        </div>
      ))}
    </div>
  )
}
