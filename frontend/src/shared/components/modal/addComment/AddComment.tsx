import { SendIcon } from '@assets/icons'
import { Button } from '@shared/components/button'
import { InputWithIcon } from '@shared/components/input-with-icon'

import s from './addComment.module.scss'
import { Comment } from './comment'
import { comments } from './data'

export const AddComment = () => {
  return (
    <div className={s.box}>
      <InputWithIcon
        icon={<SendIcon />}
        className={s.textareaBox}
        placeholder="Оставить комментарий"
      />
      <div className={s.btnBox}>
        <Button variant="secondary" children="Добавить задачу" className={s.btn} disabled isIcon />
        <Button variant="primary" children="Написать студенту" className={s.btn} disabled isIcon />
      </div>
      <div className={s.content}>
        <div className={s.messageBox}>
          {comments.map((comment) => {
            return <Comment data={comment} key={comment.id} />
          })}
        </div>
      </div>
    </div>
  )
}
