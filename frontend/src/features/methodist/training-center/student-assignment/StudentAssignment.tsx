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
import { NavLink } from 'react-router-dom'

import { AssignmentGradeModal } from './AssignmentGradeModal'
import { CommentContent } from './CommentContent'
import s from './student-assignment.module.scss'

export const StudentAssignment = () => {
  const { isOpen: isOpenDropdown, toggle: toggleDropdown } = useToggle()
  const { isOpen: isOpenModal, open: openModal, close: closeModal } = useToggle()

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
              <Input className={s.inputComment} placeholder="Отправить комментарий студенту" />
              <SendIcon />
            </div>
            <div className={s.inputBlock}>
              <Input className={s.inputComment} placeholder="Оставить внутренний комментарий" />
              <SendIcon />
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
              <>
                <CommentContent isInternalComment>
                  Конспект можно использовать для других потоков
                </CommentContent>
                <CommentContent>
                  Конспект получился отличным — структурированным и информативным! Хорошо выделены
                  ключевые правила использования электроинструментов. Однако визуализация требует
                  доработки: • Не хватает чёткости в передаче основных принципов безопасности. •
                  Можно добавить более наглядные схемы / иллюстрации с пояснениями. • Текст на
                  изображениях, проверь, чтобы он был легко читаемым. Возвращаю работу на доработку.
                  Попробуй доработать визуализацию и отправь заново! 😊
                </CommentContent>
              </>
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
