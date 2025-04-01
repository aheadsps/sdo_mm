import { Typography, Button } from '@shared/components'

import { YouTubeLogo } from '@assets/icons'

import s from './lesson-content.module.scss'

type Props = {
  onClick: () => void
}

export const LessonContent = ({ onClick }: Props) => {
  return (
    <div className={s.rightBox}>
      <div className={s.rightTop}>
        <div className={s.headerLesson}>
          <Typography variant="header_3" className={s.titleLesson}>
            4. Слова, которые мы используем неправильно
          </Typography>
          <Typography variant="header_6" className={s.countLessons}>
            4/6
          </Typography>
        </div>
        <Typography variant="body_2" className={s.lessonDesc}>
          Многие английские слова кажутся знакомыми, но их настоящие значения могут сильно
          отличаться. Это называется «ложные друзья переводчика». В этом уроке ты научишься их
          распознавать.
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
