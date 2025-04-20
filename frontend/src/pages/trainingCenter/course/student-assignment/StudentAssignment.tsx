import { PdfIcon, JpgIcon, SendIcon } from '@assets/icons'
import {
  BackToPage,
  Typography,
  Button,
  CourseMaterialItem,
  DropdownCard,
  Textarea,
} from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'

import { CommentContent } from './CommentContent'
import s from './student-assignment.module.scss'

export const StudentAssignment = () => {
  const { isOpen, toggle } = useToggle()
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
        <Button className={s.button}>К следующему студенту</Button>
      </div>
      <div className={s.mainBlock}>
        <div>
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
              <Textarea placeholder="Отправить комментарий" />
              <SendIcon />
            </div>
            <div className={s.inputBlock}>
              <Textarea placeholder="Оставить внутренний комментарий" />
              <SendIcon />
            </div>
          </div>
          <div>
            <DropdownCard
              title="История проверок"
              isOpen={isOpen}
              toggle={toggle}
              wrapperClassName={s.dropdownWrapper}
              className={s.dropdownContent}
            >
              <CommentContent />
            </DropdownCard>
          </div>
        </div>
        <div className={s.assignmentButtons}>
          <Button variant="secondary">Отправить на доработку</Button>
          <Button variant="primary">Принять работу</Button>
        </div>
      </div>
    </div>
  )
}

export const StudentAssignmentPage = withLayout(StudentAssignment)
