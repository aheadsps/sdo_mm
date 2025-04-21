import { ArrowUpRightIcon } from '@assets/icons'
import clsx from 'clsx'

import { Typography } from '../typography'

import { scheduleData } from './data'
import Format from './Format'
import s from './schedule.module.scss'

type Lesson = {
  id: number
  title: string
  format: Format
  time: string
}

type Event = {
  id: number
  day: string
  date: string
  lessons: Lesson[]
}

export type ScheduleData = {
  events: Event[]
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
                      [s.scheduleFormatOnline]: lesson.format === Format.ONLINE,
                      [s.scheduleFormatOffline]: lesson.format === Format.FILLTIME,
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
