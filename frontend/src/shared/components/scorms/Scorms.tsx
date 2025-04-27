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
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const txt = lesson.name
  const btn1 = <AiIcon />
  const btn2 = 'Обсуждение урока'

  return (
    <div className={s.scormBox}>
      <BackToPage>Вернуться на общую страницу курса</BackToPage>
      <Title
        txt={txt}
        btn1={btn1}
        btn2={btn2}
        fstBtn={toggleOffCanvas}
        disabled={true}
        disabledAi={false}
        isIconAi={false}
      />
      <Typography variant="header_3" children={lesson.name} />
      {course && <img className={s.scorms} src={course.image} />}
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
      <LessonTest />
    </div>
  )
}
