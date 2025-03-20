/* eslint-disable prettier/prettier */
import { Button } from '@shared/components'
import { LessonCard } from '@shared/components/lessonCard/LessonCard'
import { Tooltipe } from '@shared/components/tooltipe/Tooltipe'
import { withLayout } from '@shared/HOC/withLayout/withLayout'
import { useState } from 'react'

import s from './myLearning.module.scss'

const MyLearningComp = () => {
  const [mode, setMode] = useState('Назначенные курсы')
  const [isTooltipe, setIsTooltipe] = useState(true)
  const [isCount, setIsCount] = useState(3)

  const buttons = [
    'Назначенные курсы',
    'Просроченные курсы',
    'Избранные курсы',
    'Завершённые курсы',
  ]

  return (
    <>
      {isTooltipe && <Tooltipe />}
      <main className={s.container}>
        <div className={s.container__headBox}>
          <div className={s.container__btnBox}>
            {buttons.map((btn, index) => {
              return (
                <>
                  {isCount && (
                    <div className={s.container__counterBox}>
                      <p className={s.container__counter}>3</p>
                    </div>
                  )}
                  <Button
                    className={s.container__btn}
                    key={index}
                    children={btn}
                    variant={mode === btn ? 'primary' : 'secondary'}
                    onClick={() => setMode(btn)}
                  />
                </>
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
          <LessonCard />
          <LessonCard />
        </div>
        <div className={s.container__content}>
        <LessonCard />
        <LessonCard />
        </div>
      </main>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
