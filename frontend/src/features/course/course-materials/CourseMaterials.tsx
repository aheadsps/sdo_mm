import { CourseMaterialItem } from './course-material-item/CourseMaterialItem'
import s from './course-materials.module.scss'

import { PdfIcon, JpgIcon, DocIcon, PngIcon, XlsIcon } from '@/assets/icons'

export const CourseMaterials = () => {
  return (
    <div className={s.allMaterials}>
      <CourseMaterialItem title="Методы запоминания новых слов" fileExtension="PDF">
        <PdfIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Методы запоминания новых слов" fileExtension="JPG">
        <JpgIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Методы запоминания новых слов" fileExtension="DOC">
        <DocIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Методы запоминания новых слов" fileExtension="PNG">
        <PngIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Методы запоминания новых слов" fileExtension="XLS">
        <XlsIcon />
      </CourseMaterialItem>
    </div>
  )
}
