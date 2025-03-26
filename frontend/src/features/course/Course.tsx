import { Button, Tabs, Typography, AiComponent, BackToPage } from '@shared/components'
import { useState } from 'react'

import s from './course.module.scss'
import { tabsData } from './tabs/tabsData'

export const Course = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  const onButtonClick = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen)
  }
  return (
    <div className={s.courseContent}>
      <BackToPage to={'/learning'}>Вернуться к выбору курса</BackToPage>
      <div className={s.titleBlock}>
        {/* separate reusable component */}
        <Typography variant="header_4" className={s.title}>
          English Check-Up: База и первые шаги
        </Typography>
        <div className={s.buttonsBlock}>
          <Button variant="secondary" className={s.button} onClick={onButtonClick}>
            ИИ
          </Button>
          <Button variant="primary" className={s.button}>
            Обсуждение урока
          </Button>
        </div>
      </div>
      <Tabs tabs={tabsData} variant="secondary" />
      <AiComponent isOpen={isOffcanvasOpen} setIsOpen={setIsOffcanvasOpen} />
    </div>
  )
}
