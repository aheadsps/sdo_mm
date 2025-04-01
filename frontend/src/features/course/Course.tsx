import { Button, Tabs, Typography, AiComponent } from '@shared/components'
import { useToggle } from '@shared/hooks/useToggle'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { ArrowLeftIcon } from '@assets/icons'

import s from './course-comp.module.scss'
import { tabsData } from './tabs/tabsData'

export const CourseComponent = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  // const hendleNavigate = async () => {
  //   await navigate('/learning/course')
  // }
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
          <Button variant="secondary" className={s.button} onClick={toggleOffCanvas}>
            ИИ
          </Button>
          <Button variant="primary" className={s.button}>
            Обсуждение урока
          </Button>
        </div>
      </div>
      <Tabs tabs={tabsData} variant="secondary" />
      <AiComponent isOpen={isOffcanvasOpen} close={closeOffcanvas} />
    </div>
  )
  // )
}
