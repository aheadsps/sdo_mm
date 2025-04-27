import { PdfIcon, JpgIcon, DocIcon, PngIcon, XlsIcon } from '@assets/icons'
import { CourseMaterialItem } from '@shared/components'

import s from './course-materials.module.scss'

export const CourseMaterials = () => {
  return (
    <div className={s.allMaterials}>
      <CourseMaterialItem
        title="Что должно быть в аптечке для оказания первой помощи на производстве"
        fileExtension="PDF"
      >
        <PdfIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Оказание первой помощи при высотных работах" fileExtension="JPG">
        <JpgIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Первая помощь при отравлении на производстве" fileExtension="DOC">
        <DocIcon />
      </CourseMaterialItem>
      <CourseMaterialItem
        title="Оказание первой помощи при повреждениях электричеством"
        fileExtension="PNG"
      >
        <PngIcon />
      </CourseMaterialItem>
      <CourseMaterialItem title="Основы оказания первой помощи" fileExtension="XLS">
        <XlsIcon />
      </CourseMaterialItem>
    </div>
  )
}
