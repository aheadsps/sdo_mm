import { StepView } from '@services/api'
import { Typography, Button } from '@shared/components'

import s from './lesson-content.module.scss'

type Props = {
  onClick: () => void
  selectedStep: StepView
}

export const LessonContent = ({ onClick, selectedStep }: Props) => {
  console.log(selectedStep)
  return (
    <div className={s.rightBox}>
      <div className={s.rightTop}>
        <div className={s.headerLesson}>
          <Typography variant="header_3" className={s.titleLesson}>
            {selectedStep.title}
          </Typography>
          <Typography variant="header_6" className={s.countLessons}>
            {/* {selectedStep.id}/6 */}
          </Typography>
        </div>
        <Typography variant="body_2" className={s.lessonDesc}>
          {selectedStep.content_text}
        </Typography>
      </div>
      {selectedStep.attachments.map((file) => {
        if (file.file_type === 'Image') return <img key={file.id} src={file.file} />
        if (file.file_type === 'video') return <video key={file.id}></video>
      })}
      {/* <div className={s.videoBox}>
        <YouTubeLogo />
      </div> */}
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
