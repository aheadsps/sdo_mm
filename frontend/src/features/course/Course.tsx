import s from './course.module.scss'
import { tabsData } from './tabs/tabsData'

import { routes } from '@/routes/routes'
import { Button, BackToPage, Typography, Tabs, AiComponent } from '@/shared/components'
import { useToggle } from '@/shared/hooks'

export const Course = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()

  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      <div className={s.titleBlock}>
        {/* separate reusable component */}
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
}
