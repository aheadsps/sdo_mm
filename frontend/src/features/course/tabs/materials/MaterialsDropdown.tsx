import { CourseMaterials } from '@features/course/course-materials'
import { DropdownCard, Button } from '@shared/components'
import { useToggle } from '@shared/hooks'

import s from './materials.module.scss'

export const MaterialsDropdown = () => {
  const { isOpen, toggle } = useToggle()
  return (
    <DropdownCard
      title="Урок 1. Проверка стартового уровня"
      blocks="2 блока"
      isOpen={isOpen}
      toggle={toggle}
    >
      <Button className={s.materialsButton}>Скачать все материалы урока</Button>
      <CourseMaterials />
    </DropdownCard>
  )
}
