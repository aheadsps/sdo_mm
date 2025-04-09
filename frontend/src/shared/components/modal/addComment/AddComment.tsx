import { Button } from '@shared/components/button'
import { InputWithIcon } from '@shared/components/input-with-icon'
// import { useToggle } from '@shared/hooks'

import { SendIcon } from '@assets/icons'

import s from './addComment.module.scss'
import { Comment } from './comment'
import { comments } from './data'

export const AddComment = () => {
  //   const { isOpen: isOpeninput, toggle: toggleInput } = useToggle()
  return (
    <div className={s.box}>
      <InputWithIcon
        icon={<SendIcon />}
        //   onClick={toggleInput}
        className={s.textareaBox}
        placeholder="Оставить комментарий"
        //   isOpen={isOpeninput} variant?: 'primary' | 'secondary'
      />
      <div className={s.btnBox}>
        <Button variant="secondary" children="Добавить задачу" className={s.btn} />
        <Button variant="primary" children="Написать студенту" className={s.btn} />
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
