import {
  selectAllEvents,
  selectCompletedCovers,
  selectExpiredCovers,
  selectFavoriteCovers,
  selectUserCovers,
} from '@services/slices'
import { useAppSelector } from '@services/store'
import {
  AiComponent,
  Tooltipe,
  TabsButtons,
  Button,
  LessonCard,
  Typography,
} from '@shared/components'
import { SubscriptionEventsCard } from '@shared/components/subscriptionEventsCard'
import { withLayout } from '@shared/HOC'
import { useToggle } from '@shared/hooks'
import { useState } from 'react'

import s from './myLearning.module.scss'

const buttons: string[] = [
  'Все курсы',
  'Назначенные курсы',
  'Просроченные курсы',
  'Избранные курсы',
  'Завершённые курсы',
]

const MyLearningComp: React.FC = () => {
  const [mode, setMode] = useState<string>('Все курсы')
  const { isOpen: isTooltipeOpen, close: closeTooltipe } = useToggle(false)
  const { isOpen: isAIOpen, close: closeAI, toggle: toggleAI } = useToggle()
  // const dispatch = useAppDispatch()
  const subscriptionEvents = useAppSelector(selectAllEvents)
  // console.log(subscriptionEvents)
  const userCovers = useAppSelector(selectUserCovers)
  // console.log(userCovers)
  const expiredCovers = useAppSelector(selectExpiredCovers)
  const favoriteCovers = useAppSelector(selectFavoriteCovers)
  const completedCovers = useAppSelector(selectCompletedCovers)

  const displayCurrentCourses = () => {
    if (mode === 'Назначенные курсы') {
      return userCovers
    }
    if (mode === 'Просроченные курсы') {
      return expiredCovers
    }
    if (mode === 'Избранные курсы') {
      return favoriteCovers
    }
    return completedCovers
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
        {mode === 'Все курсы' ? (
          <div className={s.container__content}>
            {subscriptionEvents?.length > 0 ? (
              subscriptionEvents.map((event, index) => {
                return <SubscriptionEventsCard event={event} key={index} />
              })
            ) : (
              <Typography variant="body_1">В данном списке нет курсов</Typography>
            )}
          </div>
        ) : (
          <div className={s.container__content}>
            {displayCurrentCourses()?.length > 0 ? (
              displayCurrentCourses().map((cover, index) => {
                return <LessonCard cover={cover} key={index} />
              })
            ) : (
              <Typography variant="body_1">В данном списке нет курсов</Typography>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export const MyLearning = withLayout(MyLearningComp)
