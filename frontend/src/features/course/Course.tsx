import { routes } from '@routes/routes'
import { selectCurrentEventId, selectCurrentScorms, selectIsScorms } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Button, Tabs, Typography, AiComponent, BackToPage } from '@shared/components'
import { useToggle } from '@shared/hooks/useToggle'

import s from './course.module.scss'
import { tabsData } from './tabs/tabsData'

export const Course = () => {
  const { isOpen: isOffcanvasOpen, close: closeOffcanvas, toggle: toggleOffCanvas } = useToggle()
  const isScorms = useAppSelector(selectIsScorms)
  const currentCourseId = useAppSelector(selectCurrentEventId)
  const setCurrentScorms = useAppSelector(selectCurrentScorms)
  const currentId = isScorms ? setCurrentScorms : currentCourseId
  console.log(isScorms, currentId)
  return (
    <div className={s.courseContent}>
      <BackToPage to={routes.learning}>Вернуться к выбору курса</BackToPage>
      {isScorms ? (
        <iframe className={s.scorms}></iframe>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
