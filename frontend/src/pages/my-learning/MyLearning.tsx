/* eslint-disable prettier/prettier */
import { AiComponent, Button } from '@shared/components'
import { LessonCard } from '@shared/components/lessonCard/LessonCard'
import Loader from '@shared/components/loader/Loader'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useEffect, useState } from 'react'

import { courses } from './mockData'
import s from './myLearning.module.scss'
import { Course } from './types'

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Назначенные курсы')
  const [isTooltipe, setIsTooltipe] = useState<boolean>(true)
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false) //true false
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentCourses, setCurrentCourses] = useState<Course[] | []>([])

  const buttons = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]
  const counter = [0, 0, 3, 0]
  setTimeout(() => {
    setIsLoading(false)
  }, 3000)
 
  useEffect(()=> {
     const data:()=> Course[] | [] = () => {
    if(mode === 'Назначенные курсы') return setCurrentCourses(courses)
    if(mode === 'Просроченные курсы') return setCurrentCourses(courses.filter(el=> el.expired === true))
    if(mode === 'Избранные курсы') return setCurrentCourses(courses.filter(el=> el.isCourse === true))
    if(mode === 'Завершённые курсы') return setCurrentCourses(courses.filter(el=> el.progress === '100%'))
  }
    data()
  }, [mode])
  const hendleAiOpen = () => {
    setMode('ИИ')
    setIsAIOpen(!isAIOpen)
  }
  return (
    <>
      {isAIOpen && <AiComponent isOpen={isAIOpen} setIsOpen={setIsAIOpen}/>}
      {isTooltipe && <Tooltipe isOpen={isTooltipe} setIsOpen={setIsTooltipe}/>}
      <div className={s.container}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <div className={s.container__headBox}>
              <div className={s.container__btnBox}>
                {buttons.map((btn, index) => {
                  
                  return (
                    <div className={s.container__boxbtn} key={index}>
                      <div className={counter[index] === 0? s.container__counterBox_hidden : s.container__counterBox}>
                        <p className={s.container__counter}>{counter[index]}</p>
                      </div>
                      <Button
                        className={s.container__btn}
                        children={btn}
                        variant={mode === btn ? 'primary' : 'secondary'}
                        onClick={() => setMode(btn)
                        }
                      />
                    </div>
                  )
                })}
              </div>
              <Button
                children="ИИ"
                variant={mode === 'ИИ' && isAIOpen === true ? 'primary' : 'secondary'}
                onClick={() => hendleAiOpen()}
              />
            </div>
            <div className={s.container__content}>
              {currentCourses.map((course: Course) => {
                return <LessonCard course={course} key={course.id} />
              })}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
