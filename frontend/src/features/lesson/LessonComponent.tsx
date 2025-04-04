import { CourseMaterials } from '@features/course/course-materials'
import { AiComponent, Typography, Button, Title } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { ArrowLeftIcon } from '@assets/icons'

import { LessonContent } from './lesson-content/LessonContent'
import { LessonPlan } from './lesson-plan'
import s from './lessonComponent.module.scss'
import { lessonStepsData } from './lessonStepsData'
import { LessonTest } from './test/Tests'

export type SelectedStep = {
  id: number
  title: string
  description: string
}
const LessonComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const [selectedStep, setSelectedStep] = useState(lessonStepsData[0])

  const [isMaterialsButtonClicked, setIsMaterialsButtonClicked] = useState(false)

  const txt = 'English Check-Up: База и первые шаги'
  const btn1 = 'ИИ'
  const btn2 = 'Обсуждение урока'
  const navigate = useNavigate()

  const handleNavigate = async () => {
    await navigate('/learning/course')
  }

  const onItemClick = (item: SelectedStep) => {
    setSelectedStep(item)

    if (isMaterialsButtonClicked) {
      setIsMaterialsButtonClicked(false)
    }
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
          <LessonPlan
            setIsMaterialsButtonClicked={setIsMaterialsButtonClicked}
            onClick={onItemClick}
          />
        </div>

        {isMaterialsButtonClicked ? (
          <div className={s.lessonMaterials}>
            <Button className={s.materialsButton}>Скачать все материалы урока</Button>
            <CourseMaterials />
          </div>
        ) : selectedStep.id === lessonStepsData[lessonStepsData.length - 1].id ? (
          <LessonTest />
        ) : (
          <LessonContent onClick={handleNavigate} selectedStep={selectedStep} />
        )}
      </div>
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export const Lesson = withLayout(LessonComponent)
