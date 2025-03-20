import { Button, Typography } from '@shared/components'
import { NavLink } from 'react-router-dom'

import { ArrowLeftIcon } from '@assets/icons'

import s from './course.comp.module.scss'
import { Tabs } from './tabs/Tabs'
import { tabsData } from './tabs/tabsData'

export const CourseComponent = () => {
  return (
    <div>
      <NavLink to={'/learning'} className={s.backToPage}>
        <ArrowLeftIcon className={s.backIcon} />
        <Typography variant="body_2" className={s.backText}>
          Вернуться к выбору курса
        </Typography>
      </NavLink>
      <div className={s.titleBlock}>
        <Typography variant="header_4">English Check-Up: База и первые шаги</Typography>
        <div className={s.buttonsBlock}>
          <Button variant="secondary" className={s.button}>
            ИИ
          </Button>
          <Button variant="primary" className={s.button}>
            Обсуждение урока
          </Button>
        </div>
      </div>
      <Tabs tabs={tabsData} />
    </div>
  )
}
