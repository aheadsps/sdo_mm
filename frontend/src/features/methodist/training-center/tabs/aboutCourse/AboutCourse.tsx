import { EditIcon } from '@assets/icons'
import { selectCourse } from '@services/slices'
import { useAppSelector } from '@services/store'
import { Button, EditableText, Select, Typography } from '@shared/components'
import { DatePickerCustom } from '@shared/components/datePicker/DatePickerCustom'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

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
  { id: 14, value: 'Гуру А.С.' },
  { id: 11, value: 'Иванов И.И.' },
  { id: 13, value: 'Петров П.П.' },
  { id: 12, value: 'Сидоров А.И.' },
]

export const AboutCourse = () => {
  const currentCourse = useAppSelector(selectCourse)
  const [description, setDescription] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [date, setDate] = useState<Date | null>(new Date(currentCourse.create_date))

  useEffect(() => {
    if (currentCourse) {
      setDescription(currentCourse.description)
    }
  }, [currentCourse])

  const toggleEditMode = () => setIsEditMode((prev) => !prev)

  console.log(currentCourse, 'currentCourse')

  return (
    <div className={s.container}>
      <div className={s.leftBlock}>
        <h3 className={s.title}>Основная информация</h3>

        <DatePickerCustom
          placeholder={'Дата создания'}
          className={s.select}
          value={date}
          onChange={(newDate) => setDate(newDate)}
        />
        <DatePickerCustom placeholder={'Дата окончания'} className={s.select} />
        <div className={s.subtitle}>
          <span className={s.sutitleLeft}>Количество студентов:</span>
          <span className={s.sutitleRight}>456</span>
        </div>
        <Select options={courseStatuses} placeholder="Статус курса" className={s.select} />
        <Select options={teachers} placeholder="Преподаватель" className={s.select} />
      </div>
      <div className={s.rightBlock}>
        <div className={s.top}>
          <div className={s.titleBox}>
            <div className={s.img}>
              <EditIcon width={'15px'} height={'15px'} onClick={toggleEditMode} />
            </div>
            <Typography variant="header_3" className={s.title}>
              Цель курса
            </Typography>
          </div>
          <EditableText
            title={description}
            setTitle={setDescription}
            isEditMode={isEditMode}
            variant="body_1"
          />
        </div>
        <div className={s.buttonBox}>
          <Button
            variant="secondary"
            children="Посмотреть список учебных материалов"
            className={s.button}
            disabled
            isIcon
          />
          <Button
            variant="primary"
            children="Перейти к проверке работ"
            className={s.button}
            as={NavLink}
            to={'#'}
            disabled
            isIcon
          />
        </div>
      </div>
    </div>
  )
}
