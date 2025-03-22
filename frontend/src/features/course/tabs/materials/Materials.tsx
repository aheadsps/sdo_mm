import { CourseMaterials } from '@features/course/course-materials'
import { DropdownCard } from '@features/course/dropdown-card'
import { Button } from '@shared/components'

import s from './materials.module.scss'

export const Materials = () => {
  return (
    <div className={s.courseMaterials}>
      <DropdownCard title="Урок 1. Проверка стартового уровня" blocks="2 блока">
        <Button className={s.materialsButton}>Скачать все материалы урока</Button>
        <CourseMaterials />
      </DropdownCard>
      <DropdownCard title="Урок 2. Проверка стартового уровня" blocks="3 блока">
        <Button className={s.materialsButton}>Скачать все материалы урока</Button>
        <CourseMaterials />
      </DropdownCard>
      <DropdownCard title="Урок 3. Проверка стартового уровня" blocks="4 блока">
        <Button className={s.materialsButton}>Скачать все материалы урока</Button>
        <CourseMaterials />
      </DropdownCard>
    </div>
  )
}
