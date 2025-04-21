import { YouTubeLogo } from '@assets/icons'
import { Typography, Button } from '@shared/components'

import { SelectedStep } from '../LessonComponent'

import s from './lesson-content.module.scss'

type Props = {
  onClick: () => void
  selectedStep: SelectedStep
}

export const LessonContent = ({ onClick, selectedStep }: Props) => {
  return (
    <div className={s.rightBox}>
      <div className={s.rightTop}>
        <div className={s.headerLesson}>
          <Typography variant="header_3" className={s.titleLesson}>
            {selectedStep.title}
          </Typography>
          <Typography variant="header_6" className={s.countLessons}>
            {selectedStep.id}/6
          </Typography>
        </div>
        <Typography variant="body_2" className={s.lessonDesc}>
          {selectedStep.description}
        </Typography>
      </div>
      <div className={s.videoBox}>
        <YouTubeLogo />
      </div>
      <div className={s.hint}>
        <p className={s.hintTxt}>
          Чтобы не запоминать слова неправильно, всегда проверяй их значение в контексте!
        </p>
      </div>
      <div className={s.buttonBox}>
        <Button variant="secondary" onClick={onClick}>
          Выйти из урока
        </Button>

        <Button variant="primary">Перейти к следующей теме</Button>
      </div>
    </div>
  )
}
