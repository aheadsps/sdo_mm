import { AiIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { useGetCourseQuery } from '@services/api'
import { selectCourse, setCourseById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { Tabs, AiComponent, BackToPage, Title, Loader } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import s from './course.module.scss'
import { tabsData } from './tabsData'

export const Course = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, open: openOffCanvas } = useToggle()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { data: currentCourse, isLoading } = useGetCourseQuery(Number(id))
  const course = useAppSelector(selectCourse)
  const txt = course?.name

  useEffect(() => {
    if (currentCourse) dispatch(setCourseById(currentCourse))
  }, [currentCourse, dispatch])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      <Title
        txt={txt}
        btn1={<AiIcon />}
        btn2="Обсуждение урока"
        fstBtn={openOffCanvas}
        disabledAi={false}
        disabled={true}
        isIconAi={true}
      />
      <Tabs tabs={tabsData} variant="secondary" />
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export const CoursePage = withLayout(Course)
