import { Button, Select, Typography } from '@shared/components'
import { CalendarSelect } from '@shared/components/calendarSelect/CalendarSelect'

import { EditIcon } from '@assets/icons'

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
        <h3 className={s.title}>Основная информация</h3>
        <CalendarSelect options={dates} placeholder="Дата создания" className={s.select} />
        <CalendarSelect options={dates} placeholder="Дата окончания" className={s.select} />
        <h6 className={s.subtitle}>
          <p className={s.sutitleLeft}>Количество студентов:</p>
          <p className={s.sutitleRight}>654</p>
        </h6>
        <Select options={courseStatuses} placeholder="Статус курса" className={s.select} />
        <Select options={teachers} placeholder="Преподаватель" className={s.select} />
      </div>
      <div className={s.rightBlock}>
        <div className={s.top}>
          <div className={s.titleBox}>
            <div className={s.img}>
              <EditIcon width={'15px'} height={'15px'} />
            </div>
            <Typography variant="header_3" className={s.title}>
              Цель курса
            </Typography>
          </div>
          <Typography variant="body_1" className={s.txt}>
            Этот курс поможет тебе понять, на каком уровне ты находишься, выявить пробелы в знаниях
            и исправить их. Ты разберёшь частые ошибки в грамматике и лексике, получишь персональные
            рекомендации и выстроишь эффективную стратегию обучения.
          </Typography>
          <Typography variant="body_1" className={s.txt}>
            Курс состоит из четырёх уроков с тестами, видео и практикой. В среднем на его
            прохождение потребуется около 120 минут, но можно проходить в удобном темпе. Материалы
            доступны в любое время, а в чате можно задать вопросы и разобраться в сложных вопросах.
          </Typography>
        </div>
        <div className={s.buttonBox}>
          <Button
            variant="secondary"
            children="Посмотреть список учебных материалов"
            className={s.button}
          />
          <Button variant="primary" children="Перейти к проверке работ" className={s.button} />
        </div>
      </div>
    </div>
  )
}
