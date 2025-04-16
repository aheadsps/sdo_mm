import {
  selectCompletedEvents,
  selectCurrentEvents,
  selectExpiredEvents,
  selectFavoriteEvents,
} from '@services/slices/events'
import { useAppSelector } from '@services/store'
import {
  AiComponent,
  Tooltipe,
  TabsButtons,
  Button,
  LessonCard,
  Typography,
} from '@shared/components'
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
  const { isOpen: isTooltipeOpen, close: closeTooltipe } = useToggle(false)
  const { isOpen: isAIOpen, close: closeAI, toggle: toggleAI } = useToggle()

  const currentEvents = useAppSelector(selectCurrentEvents)
  const expiredEvents = useAppSelector(selectExpiredEvents)
  const favoriteEvents = useAppSelector(selectFavoriteEvents)
  const completedEvents = useAppSelector(selectCompletedEvents)

  const displayCurrentCourses = () => {
    if (mode === 'Все курсы') {
      return currentEvents
    }
    if (mode === 'Просроченные курсы') {
      return expiredEvents
    }
    if (mode === 'Избранные курсы') {
      return favoriteEvents
    }
    return completedEvents
  }

  return (
    <>
      <AiComponent isOpen={isAIOpen} close={closeAI} />
      {isTooltipeOpen && (
        <Tooltipe
          time="12 секунд назад"
          txt="Курс добавлен в избранное! Теперь ты легко найдёшь его в своём профиле."
          close={closeTooltipe}
        />
      )}
      <div className={s.container}>
        <div className={s.container__headBox}>
          <TabsButtons tabs={buttons} activeTab={mode} setActiveTab={setMode} />
          <Button children="ИИ" variant="secondary" onClick={toggleAI} />
        </div>
        <div className={s.container__content}>
          {displayCurrentCourses()?.length > 0 ? (
            displayCurrentCourses().map((event) => {
              return <LessonCard event={event} key={event.id} />
            })
          ) : (
            <Typography variant="body_1">В данном списке нет курсов</Typography>
          )}
        </div>
      </div>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
