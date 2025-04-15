import { ArrowRightIcon, CalendarIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { Button, InputWithIcon, Input, type Option, Select, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import { LessonType } from '../data'

import s from './lesson-content.module.scss'

type Props<T extends LessonType> = {
  lesson?: T
  options?: Option[]
  isExpandableContent?: boolean
}
export const LessonContent = <T extends LessonType>({
  lesson,
  options,
  isExpandableContent = false,
}: Props<T>) => {
  const { isOpen, toggle } = useToggle()
  return (
    <div className={s.lessonContent}>
      <div className={s.title}>
        {!lesson?.title ? (
          <Input placeholder="Введите тему" />
        ) : (
          <Typography variant="body_2">{lesson?.title ? lesson.title : 'Введите тему'}</Typography>
        )}
      </div>
      {isExpandableContent ? (
        <>
          <Select
            className={clsx(s.date, s.access)}
            placeholder={'Выберите доступ'}
            options={options}
          />
          <Button
            variant="secondary"
            className={s.constructorBtn}
            as={NavLink}
            to={routes.constructor}
          >
            <ArrowRightIcon width={'12px'} height={'12px'} />
          </Button>
        </>
      ) : (
        <>
          <InputWithIcon
            className={s.formInput}
            placeholder={lesson?.dateTime ? lesson?.dateTime : 'Введите дату урока'}
            content={'Здесь будет календарь'}
            onClick={toggle}
            icon={<CalendarIcon />}
            isOpen={isOpen}
          >
            Здесь будет календарь
          </InputWithIcon>
          <Select
            className={s.format}
            placeholder={lesson?.format ? lesson?.format : 'Формат'}
            options={options}
          />
        </>
      )}
    </div>
  )
}
