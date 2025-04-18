import { ArrowUpRightIcon } from '@assets/icons'
import clsx from 'clsx'

import { Typography } from '../typography'

import s from './schedule.module.scss'

type Lesson = {
  id: number
  title: string
  format: 'Очно' | 'Онлайн'
  time: string
}

type Event = {
  id: number
  day: string
  date: string
  lessons: Lesson[]
}

type ScheduleData = {
  events: Event[]
}

const scheduleData: ScheduleData = {
  events: [
    {
      id: 1,
      day: 'Понедельник',
      date: '21 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Вебинар «Введение в курс „Первая помощь”»',
          format: 'Очно',
          time: '12:00',
        },
        {
          id: 2,
          title: 'Урок «Первая помощь»',
          format: 'Онлайн',
          time: '12:00',
        },
      ],
    },
    {
      id: 2,
      day: 'Вторник',
      date: '22 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Практика «Первая помощь»',
          format: 'Очно',
          time: '14:00 – 18:00',
        },
      ],
    },
    {
      id: 3,
      day: 'Пятница',
      date: '25 апреля, 2025',
      lessons: [
        {
          id: 1,
          title: 'Практика «Первая помощь»',
          format: 'Очно',
          time: '09:00 – 14:00',
        },
        {
          id: 2,
          title: 'Урок «Оказание первой помощи при потере сознания и обмороке»',
          format: 'Онлайн',
          time: '16:00',
        },
        {
          id: 3,
          title: 'Урок «Остановка кровотечений и обработка ран»',
          format: 'Онлайн',
          time: '19:00',
        },
      ],
    },
  ],
}

export const Schedule: React.FC = () => {
  return (
    <div className={s.schedule}>
      <div className={s.scheduleHeader}>
        <Typography variant="header_4">Расписание</Typography>
        <ArrowUpRightIcon width={'16px'} height={'15px'} className={s.icon} />
      </div>

      {scheduleData.events.map((event) => (
        <div key={event.id} className={s.scheduleContent}>
          <div className={s.scheduleEvents}>
            <Typography variant="caption">{event.day}</Typography>
            <Typography variant="caption">{event.date}</Typography>
          </div>

          <div className={s.scheduleLessons}>
            {event.lessons.map((lesson) => (
              <div key={lesson.id} className={s.scheduleLesson}>
                <div className={s.scheduleDetails}>
                  <Typography variant="caption">{lesson.time}</Typography>
                  <Typography variant="body_2" className={s.scheduleTitle}>
                    {lesson.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    className={clsx({
                      [s.scheduleFormatOnline]: lesson.format === 'Онлайн',
                      [s.scheduleFormatOffline]: lesson.format === 'Очно',
                    })}
                  >
                    {lesson.format}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
