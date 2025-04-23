import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'

import s from './materials.module.scss'
import { MaterialsDropdown } from './MaterialsDropdown'

export const Materials = () => {
  const course = useAppSelector(selectCourse)
  const isScorm = course.is_scorm
  console.log(course.materials)
  return (
    <div className={s.courseMaterials}>
      {isScorm
        ? 'Дополнительные материалы не предусмотрены в данном курсе'
        : course.lessons.map((lesson) => {
            return <MaterialsDropdown key={lesson.id} lesson={lesson} />
          })}
    </div>
  )
}
