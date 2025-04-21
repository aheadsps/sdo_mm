import { routes } from '@routes/routes'
import { useGetCourseQuery } from '@services/api'
import { selectCourse, setCourseById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Button, Tabs, Typography, AiComponent, BackToPage } from '@shared/components'
import { useToggle } from '@shared/hooks/useToggle'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import s from './course.module.scss'
import { tabsData } from './tabs/tabsData'

export const Course = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { data: currentCourse } = useGetCourseQuery(Number(id))
  useEffect(() => {
    if (currentCourse) dispatch(setCourseById(currentCourse))
  }, [currentCourse, dispatch])
  const course = useAppSelector(selectCourse)
  // console.log(course)
  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      <div className={s.titleBlock}>
        <Typography variant="header_4" className={s.title}>
          {course.name}
        </Typography>
        <div className={s.buttonsBlock}>
          <Button variant="secondary" className={s.button} onClick={toggleOffCanvas}>
            ИИ
          </Button>
          <Button variant="primary" className={s.button}>
            Обсуждение урока
          </Button>
        </div>
      </div>
      <>
        <Tabs tabs={tabsData} variant="secondary" />
        <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
      </>
    </div>
  )
}
