import { PdfIcon, JpgIcon, SendIcon } from '@assets/icons'
import {
  BackToPage,
  Typography,
  Button,
  CourseMaterialItem,
  DropdownCard,
  Input,
} from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { ChangeEvent, useState } from 'react'
import { NavLink } from 'react-router-dom'

import { AssignmentGradeModal } from './AssignmentGradeModal'
import { CommentContent } from './CommentContent'
import s from './student-assignment.module.scss'

type CommentData = {
  id: number
  text: string
  isInternal: boolean
}

const StudentAssignment = () => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle()
  const { isOpen: isOpenModal, open: openModal, close: closeModal } = useToggle()

  const [showPlaceholder, setShowPlaceholder] = useState(true)
  const [internalComment, setInternalComment] = useState('')
  const [studentComment, setStudentComment] = useState('')
  const [allComments, setAllComments] = useState<CommentData[]>([])

  const onChangeInternalComment = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    if (value === '' && !showPlaceholder) {
      setShowPlaceholder(true)
    } else if (value !== '' && showPlaceholder) {
      setShowPlaceholder(false)
    }

    setInternalComment(value)
  }

  const onChangeStudentComment = (e: ChangeEvent<HTMLInputElement>) => {
    setStudentComment(e.currentTarget.value)
  }

  const onAddNewComment = () => {
    const text = studentComment || internalComment
    const newComment: CommentData = {
      id: Date.now(),
      text,
      isInternal: studentComment ? false : true,
    }
    setAllComments((prev) => [...prev, newComment])
    if (studentComment) {
      setStudentComment('')
    } else {
      setInternalComment('')
      setShowPlaceholder(true)
    }
  }

  return (
    <div>
      <BackToPage>Вернуться в список учеников</BackToPage>
      <div className={s.titleBlock}>
        <div>
          <Typography variant="header_1">Ивановa Мария Антоновa</Typography>
          <Typography variant="header_6">
            Задание: Правила использования электроинструментов
          </Typography>
        </div>
        <Button className={s.button} as={NavLink} to={'#'} disabled isIcon>
          К следующему студенту
        </Button>
      </div>
      <div className={s.mainBlock}>
        <div className={s.contentBlock}>
          <Typography className={s.materialTitleBlock} variant="header_5">
            Материалы студента
          </Typography>

          <div className={s.materials}>
            <CourseMaterialItem
              className={s.materialItem}
              title="Конспект урока"
              fileExtension="PDF"
            >
              <PdfIcon />
            </CourseMaterialItem>
            <CourseMaterialItem
              className={s.materialItem}
              title="Конспект урока"
              fileExtension="JPG"
            >
              <JpgIcon />
            </CourseMaterialItem>
          </div>
          <div className={s.inputs}>
            <div className={s.inputBlock}>
              <Input
                className={s.inputComment}
                placeholder="Отправить комментарий студенту"
                onChange={onChangeStudentComment}
                value={studentComment}
              />
              <SendIcon onClick={onAddNewComment} />
            </div>
            <div className={s.inputBlock} style={{ position: 'relative' }}>
              <Input
                className={s.inputComment}
                placeholder=""
                style={{ position: 'relative', zIndex: 2, backgroundColor: 'transparent' }}
                onChange={onChangeInternalComment}
                value={internalComment}
              />

              {showPlaceholder && (
                <div className={s.showPlaceholder}>
                  <span>Оставить</span>
                  <span style={{ color: 'red' }}>внутренний</span>
                  <span>комментарий</span>
                </div>
              )}

              <SendIcon onClick={onAddNewComment} />
            </div>
          </div>
          <div>
            <DropdownCard
              title="История проверок"
              isOpen={isOpenDropdown}
              toggle={toggleDropdown}
              wrapperClassName={s.dropdownWrapper}
              className={s.dropdownContent}
            >
              {allComments.length ? (
                allComments?.map((item) => (
                  <CommentContent key={item.id} isInternalComment={item.isInternal}>
                    {item.text}
                  </CommentContent>
                ))
              ) : (
                <Typography variant="body_1">Зжесь пока нет комментариев</Typography>
              )}
            </DropdownCard>
          </div>
        </div>
        <div className={s.assignmentButtons}>
          <Button variant="secondary" disabled isIcon>
            Отправить на доработку
          </Button>
          <Button variant="primary" onClick={openModal} disabled isIcon>
            Принять работу
          </Button>
        </div>
      </div>
      {isOpenModal && <AssignmentGradeModal close={closeModal} />}
    </div>
  )
}

export const StudentAssignmentPage = withLayout(StudentAssignment)
