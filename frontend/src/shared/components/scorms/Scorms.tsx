import { AiIcon } from '@assets/icons'
import { LessonTest } from '@features/user/lesson/test/Tests'
import { Lesson, useGetCourseQuery } from '@services/api'
import { useToggle } from '@shared/hooks'
import { useParams } from 'react-router-dom'

import { AiComponent } from '../ai'
import { BackToPage } from '../back-to-page'
import { Title } from '../title'
import { Typography } from '../typography'

import s from './scorms.module.scss'
type Props = {
  lesson: Lesson
}
export const Scorm = ({ lesson }: Props) => {
  const { id } = useParams()
  const { data: course } = useGetCourseQuery(Number(id))
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, open: openOffCanvas } = useToggle()

  return (
    <div className={s.scormBox}>
      <BackToPage>Вернуться на общую страницу курса</BackToPage>
      <Title
        txt={lesson.name}
        btn1={<AiIcon />}
        btn2="Обсуждение урока"
        fstBtn={openOffCanvas}
        disabledAi={false}
        disabled={true}
        isIconAi={true}
      />
      <Typography variant="header_3" children={lesson.name} />
      {course && <img className={s.scorms} src={course.image} />}
      <LessonTest />
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}
