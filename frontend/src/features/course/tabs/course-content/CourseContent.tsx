import { DropdownCard } from '@features/course'
import { Button, Typography } from '@shared/components'

import s from './course-content.module.scss'

export const CourseContent = () => {
  return (
    <>
      <DropdownCard title="Урок 1. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <Button>Открыть урок</Button>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>

      <DropdownCard title="Урок 2. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <Button>Открыть урок</Button>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>

      <DropdownCard title="Урок 3. Проверка стартового уровня" blocks="2 блока">
        <div className={s.contentTitle}>
          <Typography variant="body_2">
            Цель урока: проверить словарный запас и научиться избегать ложных друзей переводчика.
          </Typography>
          <Button>Открыть урок</Button>
        </div>
        <Typography variant="body_2">1. Введение: Почему мы путаем слова?</Typography>
      </DropdownCard>
    </>
  )
}
