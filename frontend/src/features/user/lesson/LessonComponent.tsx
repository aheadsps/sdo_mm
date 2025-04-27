import { AiIcon } from '@assets/icons'
import { StepView, useLazyGetLessonByIdQuery } from '@services/api'
import { selectLessonById, setLessonById } from '@services/slices'
import { useAppDispatch, useAppSelector } from '@services/store'
import {
  AiComponent,
  Typography,
  Button,
  Title,
  Loader,
  BackToPage,
  Scorm,
} from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks/useToggle'
import { handleError } from '@shared/utils'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { CourseMaterials } from '../course/course-materials'

import { LessonContent } from './lesson-content/LessonContent'
import { LessonPlan } from './lesson-plan'
import s from './lessonComponent.module.scss'
import { LessonTest } from './test/Tests'

const LessonComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const [isMaterialsButtonClicked, setIsMaterialsButtonClicked] = useState(false)
  const [isTest, setIsTest] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { id, lessonId } = useParams()
  const dispatch = useAppDispatch()

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

  const txt = lesson?.name
  const btn1 = <AiIcon />
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
  const hendleVisibleTests = (arg: boolean) => {
    setIsTest(arg)
  }
  useEffect(() => {
    if (lesson) setSelectedStep(lesson?.steps[0])
  }, [lesson])

  return isLoading ? (
    <Loader />
  ) : (
    <>
      {lesson?.steps.length === 0 && <Scorm lesson={lesson} />}

      {lesson?.steps.length !== undefined && lesson?.steps.length !== 0 && (
        <>
          <div className={s.container}>
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
            <Typography variant="body_2" className={s.desc}></Typography>

            <div className={s.content}>
              <div className={s.leftBox}>
                <LessonPlan
                  steps={lesson.steps}
                  tests={lesson.test_block}
                  setIsMaterialsButtonClicked={setIsMaterialsButtonClicked}
                  onClick={onItemClick}
                  onTestClick={hendleVisibleTests}
                />
              </div>
              {isMaterialsButtonClicked ? (
                <div className={s.lessonMaterials}>
                  <Button className={s.materialsButton} disabled isIcon>
                    Скачать все материалы урока
                  </Button>
                  <CourseMaterials />
                </div>
              ) : (
                <>
                  {isTest ? (
                    <LessonTest />
                  ) : (
                    <LessonContent onClick={handleNavigate} selectedStep={selectedStep} />
                  )}
                </>
              )}
            </div>
            <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
          </div>
        </>
      )}
    </>
  )
}

export const Lesson = withLayout(LessonComponent)
