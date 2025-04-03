import { Select } from '@shared/components'
import { CalendarSelect } from '@shared/components/calendarSelect/CalendarSelect'

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

const dates: Option[] = [
  { id: 101, value: '25.06.2024' },
  { id: 102, value: '13.02.2025' },
  { id: 103, value: '04.07.2022' },
  { id: 104, value: '18.12.2024' },
]
export const AboutCourse = () => {
  return (
    <div className={s.container}>
      <div className={s.leftBlock}>
        <h3 className={s.leftBlock__title}>Основная информация</h3>
        <CalendarSelect options={dates} placeholder="Дата создания" className={s.select} />
        <CalendarSelect options={dates} placeholder="Дата окончания" className={s.select} />
        <h6 className={s.leftBlock__subtitle}>
          <p className={s.sutitleLeft}>Количество студентов:</p>
          <p className={s.sutitleRight}>654</p>
        </h6>
        <Select options={courseStatuses} placeholder="Статус курса" className={s.select} />
        <Select options={teachers} placeholder="Преподаватель" className={s.select} />
      </div>
      <div className={s.rightBlock}></div>
    </div>
  )
}
