import { DislikeIcon, LikeIcon } from '@assets/icons'
import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Card, Typography, ProgressBar } from '@shared/components'
import { useState } from 'react'

import { LessonItemCard } from '../../lesson-item-card'

import s from './about-course.module.scss'

export const AboutCourse = () => {
  const course = useAppSelector(selectCourse)
  const lessons = Number(course.lessons.length)
  const [isFav, setIsFav] = useState<boolean>(false)
  console.log(course)
  return (
    <div className={s.container}>
      <Card className={s.progress}>
        <div className={s.progressInfo}>
          <div className={s.progressTexts}>
            <Typography variant="body_2" className={s.body2Text}>
              Общий прогресс: <span>{Math.floor(Math.random() * 100) + 1}</span>
            </Typography>
            <Typography variant="body_2" className={s.body2Text}>
              1 урок из {lessons}
            </Typography>
          </div>
          <ProgressBar progress={1} total={lessons} />
        </div>
        {isFav ? (
          <LikeIcon className={s.icon} onClick={() => setIsFav(!isFav)} />
        ) : (
          <DislikeIcon className={s.icon} onClick={() => setIsFav(!isFav)} />
        )}
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
