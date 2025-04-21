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
  // const event = useAppSelector(selectEvent)
  /* const isScorms = Boolean(course.scorms.length > 0) */
  // const isScorms = course.is_scorm
  // const currentCourseId = useAppSelector(selectCurrentEventId)
  // const currentScorms = useAppSelector(selectCurrentScorms)
  // if (isScorms) const [getScormById] = useLazyGetScormByIdQuery(currentScorms[0])
  // useEffect(() => {
  //   getScormById()
  //     .unwrap()
  //     .then((res) => dispatch(setScormById(res.results)))
  //     .catch((error) => handleError(error))
  //     .finally(() => setisLoading(false))
  // }, [getScormById, dispatch])
  // const currentId = isScorms ? currentScorms : currentCourseId
  console.log(course)
  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      <div className={s.titleBlock}>
        {/* separate reusable component */}
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
