import { Typography, Button } from '@shared/components'
import clsx from 'clsx'
import { ReactNode } from 'react'

import s from './course-material-item.module.scss'

type Props = {
  title: string
  fileExtension: string
  children: ReactNode
  className?: string
}
export const CourseMaterialItem = ({ title, fileExtension, children, className }: Props) => {
  return (
    <div className={clsx(s.item, className)}>
      <Typography variant="caption">{title}</Typography>
      {children}
      <Button variant="secondary">Скачать {fileExtension}</Button>
    </div>
  )
}
