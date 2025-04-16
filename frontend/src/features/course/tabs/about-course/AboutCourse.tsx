import { DislikeIcon, LikeIcon } from '@assets/icons'
import { selectCourse, selectEvent } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Card, Typography, ProgressBar } from '@shared/components'

import { LessonItemCard } from '../../lesson-item-card'

import s from './about-course.module.scss'

export const AboutCourse = () => {
  const event = useAppSelector(selectEvent)
  const course = useAppSelector(selectCourse)
  console.log(event)
  console.log(course)
  const lessons = Number(course.lessons.length)
  return (
    <div className={s.container}>
      <Card className={s.progress}>
        <div className={s.progressInfo}>
          <div className={s.progressTexts}>
            <Typography variant="body_2" className={s.body2Text}>
              Общий прогресс: <span>50%</span>
            </Typography>
            <Typography variant="body_2" className={s.body2Text}>
              1 урок из {lessons}
            </Typography>
          </div>
          <ProgressBar progress={1} total={lessons} />
        </div>
        {event?.favorite ? <LikeIcon className={s.icon} /> : <DislikeIcon className={s.icon} />}
      </Card>

      <Card className={s.lessons}>
        <Typography variant="header_6">Уроки курса</Typography>
        <Typography variant="body_2" className={s.body2Text}>
          {lessons} урока
        </Typography>
        <div className={s.lessonItems}>
          {course.lessons.map((lesson) => {
            return <LessonItemCard key={lesson.id} lesson={lesson} />
          })}
          {/* <Button variant="secondary" className={s.lessonItemButton}>
            Продолжить
          </Button> */}
        </div>
      </Card>

      <Card className={s.goal}>
        <Typography variant="header_6" className={s.courseGoalTitle}>
          Цель курса
        </Typography>
        <Typography variant="body_2" className={s.courseGoalDescription}>
          {course.description}
        </Typography>
      </Card>
    </div>
  )
}
