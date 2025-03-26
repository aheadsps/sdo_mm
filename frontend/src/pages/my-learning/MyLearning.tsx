import { AiComponent, Button } from '@shared/components'
import { LessonCard } from '@shared/components/lessonCard/LessonCard'
import Loader from '@shared/components/loader/Loader'
import { TabsButtons } from '@shared/components/tabsButtons/TabsButtons'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useToggle } from '@shared/hooks/useToggle'
import { useState } from 'react'

import { getCurrentCourses } from './mockData'
import s from './myLearning.module.scss'
import { Course } from './types'

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isOpen: isTooltipeOpen, close: closeTooltipe } = useToggle(true)
  const { isOpen: isAIOpen, close: closeAI, toggle: toggleAI } = useToggle()

  const buttons: string[] = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)
  const currentCourses: Course[] = getCurrentCourses(mode)
  return (
    <>
      {isAIOpen && <AiComponent isOpen={isAIOpen} close={closeAI} />}
      {isTooltipeOpen && <Tooltipe close={closeTooltipe} />}
      <div className={s.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={s.container__headBox}>
              <TabsButtons tabs={buttons} activeTab={mode} setActiveTab={setMode} />
              <Button children="ИИ" variant="secondary" onClick={toggleAI} />
            </div>
            <div className={s.container__content}>
              {currentCourses.length > 0
                ? currentCourses.map((course: Course) => {
                    return <LessonCard course={course} key={course.id} />
                  })
                : ''}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
