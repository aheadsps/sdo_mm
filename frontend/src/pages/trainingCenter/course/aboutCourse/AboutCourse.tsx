import { CalendarIcon, EditIcon } from '@assets/icons'
import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Button, InputWithIcon, Select, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks'
import { formatDate } from '@shared/utils'

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
  const { isOpen: isOpenStart, toggle: toggleStart } = useToggle()
  const { isOpen: isOpenEnd, toggle: toggleEnd } = useToggle()

  const currentCourse = useAppSelector(selectCourse)
  console.log(currentCourse)
  return (
    <div className={s.container}>
      <div className={s.leftBlock}>
        <h3 className={s.title}>Основная информация</h3>
        <InputWithIcon
          children={'Здесь будет календарь'}
          className={s.select}
          placeholder={formatDate(currentCourse.create_date)}
          isOpen={isOpenStart}
          icon={<CalendarIcon />}
          onClick={toggleStart}
          // type="date"
        />
        <InputWithIcon
          className={s.select}
          placeholder="Дата окончания"
          children={'Здесь будет календарь'}
          onClick={toggleEnd}
          icon={<CalendarIcon />}
          isOpen={isOpenEnd}
          // type="date"
        />
        <h6 className={s.subtitle}>
          <p className={s.sutitleLeft}>Количество студентов:</p>
          <p className={s.sutitleRight}> {Math.floor(Math.random() * 1500) + 1}</p>
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
            {currentCourse.description}
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
