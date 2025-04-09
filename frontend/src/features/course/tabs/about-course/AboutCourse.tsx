import { HeartFilledIcon } from '@assets/icons'
import { Card, Typography, Button, ProgressBar } from '@shared/components'

import { LessonItemCard } from '../../lesson-item-card'

import s from './about-course.module.scss'

export const AboutCourse = () => {
  return (
    <div className={s.container}>
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
          <ProgressBar progress={2} total={4} />
        </div>
        <HeartFilledIcon width={'34px'} height={'34px'} className={s.icon} />
      </Card>

      <Card className={s.lessons}>
        <Typography variant="header_6">Уроки курса</Typography>
        <Typography variant="body_2" className={s.body2Text}>
          4 урока
        </Typography>
        <div className={s.lessonItems}>
          <LessonItemCard />
          <LessonItemCard />
          <LessonItemCard>
            <Button variant="secondary" className={s.lessonItemButton}>
              Продолжить
            </Button>
          </LessonItemCard>
          <LessonItemCard />
        </div>
      </Card>

      <Card className={s.goal}>
        <Typography variant="header_6" className={s.courseGoalTitle}>
          Цель курса
        </Typography>
        <Typography variant="body_2" className={s.courseGoalDescription}>
          Этот курс поможет тебе понять, на каком уровне ты находишься...
        </Typography>
      </Card>
    </div>
  )
}
