import { DropdownCard } from '@shared/components'
import { Button, Typography } from '@shared/components'
import { NavLink } from 'react-router-dom'

import s from './course-content.module.scss'

export const CourseContent = () => {
  return (
    <>
      <DropdownCard title="Урок 1. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <NavLink to={'/learning/course/lesson'}>
            <Button className={s.lessonButton}>Открыть урок</Button>
          </NavLink>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>

      <DropdownCard title="Урок 2. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <NavLink to={'/learning/course/lesson'}>
            <Button className={s.lessonButton}>Открыть урок</Button>
          </NavLink>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>

      <DropdownCard title="Урок 3. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <NavLink to={'/learning/course/lesson'}>
            <Button className={s.lessonButton}>Открыть урок</Button>
          </NavLink>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>
    </>
  )
}
