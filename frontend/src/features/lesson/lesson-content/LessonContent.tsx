import { YouTubeLogo } from '@assets/icons'
import { StepView } from '@services/api'
import { Typography, Button } from '@shared/components'

// import { SelectedStep } from '../LessonComponent'

import s from './lesson-content.module.scss'

type Props = {
  steps?: StepView[]
  onClick: () => void
  selectedStep: StepView
}

export const LessonContent = ({ steps, onClick, selectedStep }: Props) => {
  console.log(selectedStep, steps)
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
          {selectedStep.content_text}
        </Typography>
      </div>
      <div className={s.videoBox}>
        <YouTubeLogo />
      </div>
      <div className={s.hint}>
        <p className={s.hintTxt}>
          Чтобы в экстренной ситуации не растеряться - тренируйся в спокойной обстановке на
          манекене.
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
