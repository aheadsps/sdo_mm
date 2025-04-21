import { ArrowLeftIcon } from '@assets/icons'
import { CourseMaterials } from '@features/course/course-materials'
import { StepView, useLazyGetLessonByIdQuery } from '@services/api'
import { selectLessonById, setLessonById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import { AiComponent, Typography, Button, Title } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { handleError } from '@shared/utils'
import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { LessonContent } from './lesson-content/LessonContent'
import { LessonPlan } from './lesson-plan'
import s from './lessonComponent.module.scss'
// import { lessonStepsData } from './lessonStepsData'
import { LessonTest } from './test/Tests'

// export type SelectedStep = {
//   id: number
//   title: string
//   content_text: string
// }
const LessonComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const [isMaterialsButtonClicked, setIsMaterialsButtonClicked] = useState(false)
  const { id, lessonId } = useParams()
  const dispatch = useAppDispatch()
  // const { data: currentCourse } = useGetCourseQuery(Number(id))
  // useEffect(() => {
  //   if (currentCourse) dispatch(setCourseById(currentCourse))
  // }, [currentCourse, dispatch])
  // const course = useAppSelector(selectCourse)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [getLessonById] = useLazyGetLessonByIdQuery()
  useEffect(() => {
    getLessonById(Number(lessonId))
      .unwrap()
      .then((res) => {
        dispatch(setLessonById(res))
      })
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false))
  }, [getLessonById, dispatch, lessonId])
  const lesson = useAppSelector(selectLessonById)
  const [selectedStep, setSelectedStep] = useState(lesson?.steps[0])
  console.log(lesson)
  const txt = lesson.name
  const btn1 = 'ИИ'
  const btn2 = 'Обсуждение урока'
  const navigate = useNavigate()

  const handleNavigate = async () => {
    await navigate(`/learning/course/${id}`)
  }

  const onItemClick = (item: StepView) => {
    setSelectedStep(item)

    if (isMaterialsButtonClicked) {
      setIsMaterialsButtonClicked(false)
    }
  }

  return (
    <div className={s.container}>
      <NavLink to={`/learning/course/${id}`} className={s.backToPage}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться на общую страницу курса
        </Typography>
      </NavLink>

      <Title txt={txt} btn1={btn1} btn2={btn2} fstBtn={toggleOffCanvas} />
      <Typography variant="body_2" className={s.desc}>
        {/* {lesson.description} */}
      </Typography>
      <div className={s.content}>
        <div className={s.leftBox}>
          <LessonPlan
            lesson={lesson}
            setIsMaterialsButtonClicked={setIsMaterialsButtonClicked}
            onClick={onItemClick}
          />
        </div>

        {/* {isMaterialsButtonClicked ? (
          <div className={s.lessonMaterials}>
            <Button className={s.materialsButton}>Скачать все материалы урока</Button>
            <CourseMaterials />
          </div>
        ) : selectedStep.id === lesson.steps[lesson.steps.length - 1].id ? (
          <LessonTest />
        ) : (
          <LessonContent onClick={handleNavigate} selectedStep={selectedStep} />
        )} */}
      </div>
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export const Lesson = withLayout(LessonComponent)
