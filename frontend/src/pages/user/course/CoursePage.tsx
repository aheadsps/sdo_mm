import { AiIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useGetCourseQuery } from '@services/api'
import { selectCourse, setCourseById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Button, Tabs, Typography, AiComponent, BackToPage, Title } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import s from './course.module.scss'
import { tabsData } from './tabsData'

export const Course = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { data: currentCourse } = useGetCourseQuery(Number(id))
  useEffect(() => {
    if (currentCourse) dispatch(setCourseById(currentCourse))
  }, [currentCourse, dispatch])
  const course = useAppSelector(selectCourse)

  const txt = course?.name
  const btn1 = <AiIcon />
  const btn2 = 'Обсуждение урока'
  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      <Title
        txt={txt}
        btn1={btn1}
        btn2={btn2}
        fstBtn={toggleOffCanvas}
        disabled={true}
        disabledAi={false}
        isIconAi={false}
      />
      {/* <div className={s.titleBlock}>
        <Typography variant="header_4" className={s.title}>
          {course.name}
        </Typography>
        <div className={s.buttonsBlock}>
          <AiIcon onClick={toggleOffCanvas} className={s.ai} />
          <Button variant="primary" className={s.button} disabled isIcon>
            Обсуждение урока
          </Button>
        </div>
      </div> */}
      <>
        <Tabs tabs={tabsData} variant="secondary" />
        <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
      </>
    </div>
  )
}

export const CoursePage = withLayout(Course)
