import { Lesson } from '@services/api'
import { DropdownCard, Button } from '@shared/components'
import { useToggle } from '@shared/hooks'

import { CourseMaterials } from '../../course-materials'

import s from './materials.module.scss'
type Props = {
  lesson: Lesson
}
export const MaterialsDropdown = ({ lesson }: Props) => {
  const { isOpen, toggle } = useToggle()
  return (
    <DropdownCard
      title={lesson.name}
      blocks={`${lesson.serial} блок`}
      isOpen={isOpen}
      toggle={toggle}
    >
      <Button className={s.materialsButton}>Скачать все материалы урока</Button>
      <CourseMaterials />
    </DropdownCard>
  )
}
