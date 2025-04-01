import { AiComponent, Button, Typography } from '@shared/components'
import Title from '@shared/components/title/Title'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { NavLink, useNavigate } from 'react-router-dom'

import { ArrowLeftIcon, YouTubeLogo } from '@assets/icons'

import { LessonPlan } from './lesson-plan'
import s from './lessonComponent.module.scss'

// interface Props {
//   //   isLessonOpen: boolean
//   setIsLessonOpen: (isLessonOpen: boolean) => void
//   children?: ReactNode
// }

const LessonComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const txt = 'English Check-Up: База и первые шаги'
  const btn1 = 'ИИ'
  const btn2 = 'Обсуждение урока'
  const navigate = useNavigate()

  const hendleNavigate = async () => {
    await navigate('/learning/course')
  }

  return (
    <div className={s.container}>
      <NavLink to={'/learning/course'} className={s.backToPage}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться к выбору курса
        </Typography>
      </NavLink>
      {/* <div className={s.backToPage} onClick={() => hendleNavigate()}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться на общую страницу курса
        </Typography>
      </div> */}
      <Title txt={txt} btn1={btn1} btn2={btn2} fstBtn={toggleOffCanvas} />
      <Typography variant="body_2" className={s.desc}>
        Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
      </Typography>
      <div className={s.content}>
        <div className={s.leftBox}>
          <LessonPlan />
        </div>
        <div className={s.rightBox}>
          <div className={s.rightTop}>
            <div className={s.headerLesson}>
              <Typography variant="header_3" className={s.titleLesson}>
                4. Слова, которые мы используем неправильно
              </Typography>
              <Typography variant="header_6" className={s.countLessons}>
                4/6
              </Typography>
            </div>
            <Typography variant="body_2" className={s.lessonDesc}>
              Многие английские слова кажутся знакомыми, но их настоящие значения могут сильно
              отличаться. Это называется «ложные друзья переводчика». В этом уроке ты научишься их
              распознавать.
            </Typography>
          </div>
          <div className={s.videoBox}>
            <YouTubeLogo />
          </div>
          <div className={s.hint}>
            <p className={s.hintTxt}>
              Чтобы не запоминать слова неправильно, всегда проверяй их значение в контексте!
            </p>
          </div>
          <div className={s.buttonBox}>
            <Button variant="secondary" onClick={() => hendleNavigate()}>
              Выйти из урока
            </Button>

            <Button variant="primary">Перейти к следующей теме</Button>
          </div>
        </div>
      </div>
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export const Lesson = withLayout(LessonComponent)
