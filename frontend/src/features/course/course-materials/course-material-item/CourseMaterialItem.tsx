import { Typography } from '@shared/components'
import { Button } from '@shared/components'
import { ReactNode } from 'react'

import s from './course-material-item.module.scss'

type Props = {
  title: string
  fileExtension: string
  children: ReactNode
}
export const CourseMaterialItem = ({ title, fileExtension, children }: Props) => {
  return (
    <div className={s.item}>
      <Typography variant="caption">{title}</Typography>
      {children}
      <Button variant="secondary">Скачать {fileExtension}</Button>
    </div>
  )
}
