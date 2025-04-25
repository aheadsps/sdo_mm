import { Typography } from '@shared/components'

import s from './student-assignment.module.scss'

type Props = {
  isInternalComment?: boolean
  children: string
}
export const CommentContent = ({ isInternalComment, children }: Props) => {
  return (
    <div>
      <div className={s.commentOwner}>
        <Typography variant="body_1">Мария Комаровa</Typography>
        {isInternalComment && (
          <Typography variant="body_1" className={s.internal}>
            Внутренний
          </Typography>
        )}
      </div>
      <div className={s.dateTime}>
        <Typography variant="caption">04.05.25</Typography>
        <Typography variant="caption">17:30</Typography>
      </div>
      <Typography className={s.commentText} variant="body_2">
        {children}
      </Typography>
    </div>
  )
}
