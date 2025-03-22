/* eslint-disable prettier/prettier */
import { Button } from '@shared/components'
import { LessonCard } from '@shared/components/lessonCard/LessonCard'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useState } from 'react'

import { courses, lessons } from './mockData'
import s from './myLearning.module.scss'
import { Course, Lesson } from './types'
import { AIComponent } from '@shared/components/ai-component/AIComponent'
import Loader from '@shared/components/loader/Loader'

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Назначенные курсы')
  const [isTooltipe, setIsTooltipe] = useState<boolean>(true)
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const buttons = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)
  
  return (
    <>
      {isTooltipe && <Tooltipe />}
      {isAIOpen && <AIComponent />}
      <main className={s.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={s.container__headBox}>
              <div className={s.container__btnBox}>
                {buttons.map((btn, index) => {
                  const count = index + 1
                  return (
                    <div className={s.container__boxbtn} key={index}>
                      <div className={s.container__counterBox}>
                        <p className={s.container__counter}>{count}</p>
                      </div>
                      <Button
                        className={s.container__btn}
                        children={btn}
                        variant={mode === btn ? 'primary' : 'secondary'}
                        onClick={() => setMode(btn)}
                      />
                    </div>
                  )
                })}
              </div>
              <Button
                children="ИИ"
                variant={mode === 'ИИ' ? 'primary' : 'secondary'}
                onClick={() => setMode('ИИ')}
              />
            </div>
            <div className={s.container__content}>
              {courses.map((course: Course) => {
                return <LessonCard course={course} key={course.id} />
              })}
            </div>
            <div className={s.container__content}>
              {lessons.map((lesson: Lesson) => {
                return <LessonCard course={lesson} key={lesson.id} />
              })}
            </div>
          </>
        )}
      </main>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
