import { DropdownCard } from '@features/course'
import { AiComponent, Button, Typography } from '@shared/components'
import Video from '@shared/components/video/VideoComponent'
import { useToggle } from '@shared/hooks/useToggle'
import { ReactNode } from 'react'

import { ArrowLeftIcon, YouTubeLogo } from '@assets/icons'

import s from './lessonComponent.module.scss'

interface Props {
  //   isLessonOpen: boolean
  setIsLessonOpen: (isLessonOpen: boolean) => void
  children?: ReactNode
}

const LessonComponent = ({ setIsLessonOpen }: Props) => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  return (
    <div className={s.container}>
      <div className={s.backToPage} onClick={() => setIsLessonOpen(false)}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться на общую страницу курса
        </Typography>
      </div>
      <div className={s.titleBlock}>
        <Typography variant="header_4" className={s.title}>
          English Check-Up: База и первые шаги
        </Typography>
        <div className={s.buttonsBlock}>
          <Button variant="secondary" className={s.button} onClick={toggleOffCanvas}>
            ИИ
          </Button>
          <Button variant="primary" className={s.button}>
            Обсуждение урока
          </Button>
        </div>
      </div>
      <Typography variant="body_2" className={s.desc}>
        Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
      </Typography>
      <div className={s.content}>
        <div className={s.leftBox}>
          <DropdownCard title="План урока:" blocks="6 тем" className={s.drpdnContent}>
            <ul>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
              </li>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">2. Ложные друзья: похожие, но разные</Typography>
              </li>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">3. Слова с несколькими значениями</Typography>
              </li>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">
                  4. Слова, которые мы используем неправильно
                </Typography>
              </li>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">5. Как запоминать новые слова правильно?</Typography>
              </li>
              <li className={s.lessonTheme}>
                <div className={s.checkboxContainer}>
                  <input type="checkbox" className={s.checkbox} />
                </div>
                <Typography variant="body_2">6. Заключение: Закрепляем знания</Typography>
              </li>
            </ul>
            <Button variant="secondary" className={s.btn}>
              Материалы урока
            </Button>
          </DropdownCard>
        </div>
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
            <Video />
            {/* <YouTubeLogo /> */}
          </div>
          <div className={s.hint}>
            <p className={s.hintTxt}>
              Чтобы не запоминать слова неправильно, всегда проверяй их значение в контексте!
            </p>
          </div>
          <div className={s.buttonBox}>
            <Button variant="secondary" onClick={() => setIsLessonOpen(false)}>
              Выйти из урока
            </Button>
            <Button variant="primary">Перейти к следующей теме</Button>
          </div>
        </div>
      </div>
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export default LessonComponent
