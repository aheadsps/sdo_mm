import { DropdownCard } from '@features/course'
import { AiComponent, Button, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks/useToggle'
import { ReactNode } from 'react'

import { ArrowLeftIcon } from '@assets/icons'

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
      <div className={s.content}></div>
      {/* <DropdownCard title="Урок 1. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <Button className={s.lessonButton}>Открыть урок</Button>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard> */}
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
}

export default LessonComponent
