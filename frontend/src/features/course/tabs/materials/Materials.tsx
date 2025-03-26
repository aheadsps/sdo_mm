import { CourseMaterials } from '@features/course/course-materials'
import { Button } from '@shared/components'
import { DropdownCard } from '@shared/components/dropdown-card'

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
