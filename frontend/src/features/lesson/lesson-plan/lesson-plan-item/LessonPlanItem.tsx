import { Typography } from '@shared/components'
import { ReactNode } from 'react'

import s from './lesson-plan.item.module.scss'

type Props = {
  children: ReactNode
  onClick: () => void
  checked: boolean
}
export const LessonPlanItem = ({ children, onClick, checked }: Props) => {
  return (
    <li className={s.lessonTheme}>
      <div className={s.checkboxContainer}>
        <input type="checkbox" className={s.checkbox} onClick={onClick} checked={checked} />
      </div>
      <Typography variant="body_2">{children}</Typography>
    </li>
  )
}
