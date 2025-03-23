import { Button, Tabs, Typography } from '@shared/components'
import { Offcanvas } from '@shared/components/offcanvas/Offcanvas'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { ArrowLeftIcon } from '@assets/icons'

import s from './course-comp.module.scss'
import { tabsData } from './tabs/tabsData'

export const CourseComponent = () => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)

  const onButtonClick = () => {
    setIsOffcanvasOpen(!isOffcanvasOpen)
  }
  return (
    <div className={s.courseContent}>
      <NavLink to={'/learning'} className={s.backToPage}>
        <ArrowLeftIcon className={s.icon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться к выбору курса
        </Typography>
      </NavLink>
      <div className={s.titleBlock}>
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
      <Offcanvas isOpen={isOffcanvasOpen} setIsOpen={setIsOffcanvasOpen} />
    </div>
  )
}
