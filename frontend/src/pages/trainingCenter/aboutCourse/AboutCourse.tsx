import { Select } from '@shared/components'

import s from './aboutCourse.module.scss'
type Option = {
  id: number
  value: string
}
const courseStatuses: Option[] = [
  { id: 1, value: 'Опубликован' },
  { id: 2, value: 'Завершён' },
  { id: 3, value: 'Черновик' },
  { id: 4, value: 'Архив' },
]

const teachers: Option[] = [
  { id: 11, value: 'Иванов И.И.' },
  { id: 12, value: 'Сидоров А.И.' },
  { id: 13, value: 'Петров П.П.' },
  { id: 14, value: 'Гуру А.С.' },
]
export const AboutCourse = () => {
  return (
    <div className={s.container}>
      <div className={s.leftBlock}>
        <h3 className={s.leftBlock__title}>Основная информация</h3>
        <Select options={courseStatuses} placeholder="Дата создания" />
        <Select options={courseStatuses} placeholder="Дата окончания" />
        <h6 className={s.leftBlock__subtitle}>
          <p className={s.sutitleLeft}>Количество студентов:</p>
          <p className={s.sutitleRight}>654</p>
        </h6>
        <Select options={courseStatuses} placeholder="Статус курса" />
        <Select options={teachers} placeholder="Преподаватель" />
      </div>
      <div className={s.rightBlock}></div>
    </div>
  )
}
