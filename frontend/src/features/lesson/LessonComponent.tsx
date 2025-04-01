import { AiComponent, Typography } from '@shared/components'
import Title from '@shared/components/title/Title'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { ArrowLeftIcon } from '@assets/icons'

import { LessonContent } from './lesson-content/LessonContent'
import { LessonPlan } from './lesson-plan'
import s from './lessonComponent.module.scss'
import { lessonStepsData } from './lessonStepsData'

export type SelectedStep = {
  id: number
  title: string
  description: string
}
const LessonComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const [selectedStep, setSelectedStep] = useState(lessonStepsData[0])

  const txt = 'English Check-Up: База и первые шаги'
  const btn1 = 'ИИ'
  const btn2 = 'Обсуждение урока'
  const navigate = useNavigate()

  const handleNavigate = async () => {
    await navigate('/learning/course')
  }

  return (
    <div className={s.container}>
      <NavLink to={'/learning/course'} className={s.backToPage}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться на общую страницу курса
        </Typography>
      </NavLink>

      <Title txt={txt} btn1={btn1} btn2={btn2} fstBtn={toggleOffCanvas} />
      <Typography variant="body_2" className={s.desc}>
        Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
      </Typography>
      <div className={s.content}>
        <div className={s.leftBox}>
          <LessonPlan setSelectedStep={setSelectedStep} />
        </div>
        <LessonContent onClick={handleNavigate} selectedStep={selectedStep} />
        {/* <LessonTest /> */}
      </div>
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export const Lesson = withLayout(LessonComponent)
