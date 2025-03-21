import { LessonItemCard } from '@features/course'
import { Card, Typography } from '@shared/components'
import { calculateProgress } from '@shared/utils'

import { HeartFilledIcon } from '@assets/icons'

import s from './about-course.module.scss'

export const AboutCourse = () => {
  return (
    <div className={s.container}>
      {/* Progress Section */}
      <Card className={s.progress}>
        <div className={s.progressInfo}>
          <div className={s.progressTexts}>
            <Typography variant="body_2" className={s.body2Text}>
              Общий прогресс: <span>50%</span>
            </Typography>
            <Typography variant="body_2" className={s.body2Text}>
              2 урока из 4
            </Typography>
          </div>
          <div className={s.progressBar}>
            <div
              className={s.progressBarIndicator}
              style={{ width: `${calculateProgress(2, 4)}%` }}
            ></div>
          </div>
        </div>
        <HeartFilledIcon width={'34px'} height={'34px'} />
      </Card>

      {/* Lessons Section */}
      <Card className={s.lessons}>
        <Typography variant="header_6">Уроки курса</Typography>
        <Typography variant="body_2" className={s.body2Text}>
          4 урока
        </Typography>
        <div className={s.lessonItems}>
          <LessonItemCard />
          <LessonItemCard />
          <LessonItemCard />
          <LessonItemCard />
        </div>
      </Card>

      {/* Course Goal Section */}
      <Card className={s.goal}>
        <h2>Цель курса:</h2>
        <p>Этот курс поможет тебе понять, на каком уровне ты находишься...</p>
      </Card>
    </div>
  )
}
