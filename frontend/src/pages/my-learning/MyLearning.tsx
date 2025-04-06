import { selectCurrentEvents, selectExpiredEvents } from '@services/events'
import { useAppSelector } from '@services/store'
import { AiComponent, Tooltipe, TabsButtons, Button, LessonCard } from '@shared/components'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useState } from 'react'

import s from './myLearning.module.scss'

const buttons: string[] = [
  'Все курсы',
  'Просроченные курсы',
  'Избранные курсы',
  'Завершённые курсы',
]

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Все курсы')
  const { isOpen: isTooltipeOpen, close: closeTooltipe } = useToggle(true)
  const { isOpen: isAIOpen, close: closeAI, toggle: toggleAI } = useToggle()

  const currentEvents = useAppSelector(selectCurrentEvents)
  const expiredEvents = useAppSelector(selectExpiredEvents)

  const displayCurrentCourses = () => {
    if (mode === 'Все курсы') {
      return currentEvents
    }
    if (mode === 'Просроченные курсы') {
      return expiredEvents
    }
    return currentEvents
  }

  return (
    <>
      <AiComponent isOpen={isAIOpen} close={closeAI} />
      {isTooltipeOpen && <Tooltipe close={closeTooltipe} />}
      <div className={s.container}>
        <div className={s.container__headBox}>
          <TabsButtons tabs={buttons} activeTab={mode} setActiveTab={setMode} />
          <Button children="ИИ" variant="secondary" onClick={toggleAI} />
        </div>
        <div className={s.container__content}>
          {displayCurrentCourses()?.length > 0
            ? displayCurrentCourses().map((event) => {
                return <LessonCard event={event} key={event.id} />
              })
            : ''}
        </div>
      </div>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
