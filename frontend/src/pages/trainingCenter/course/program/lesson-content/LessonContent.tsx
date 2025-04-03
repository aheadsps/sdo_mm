import { Button, FormInput, Input, type Option, Select, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks/useToggle'
import clsx from 'clsx'

import { ArrowRightIcon } from '@assets/icons'
import CalendarIcon from '@assets/icons/CalendarIcon'

import { LessonType } from '../data'

import s from './lesson-content.module.scss'

//todo: добавить тип для lesson и лучше переименовать

type Props<T extends LessonType> = {
  lesson?: T
  optionsDate?: Option[]
  optionsFormat?: Option[]
  isExpandableContent?: boolean
}
export const LessonContent = <T extends LessonType>({
  lesson,
  optionsFormat,
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
            options={optionsFormat}
          />
          <Button variant="secondary" className={s.constructorBtn}>
            <ArrowRightIcon width={'12px'} height={'12px'} />
          </Button>
        </>
      ) : (
        <>
          <FormInput
            className={s.formInput}
            placeholder={lesson?.dateTime ? lesson?.dateTime : 'Введите дату урока'}
            content={'Здесь будет календарь'}
            onClick={toggle}
            icon={<CalendarIcon />}
            isOpen={isOpen}
          >
            Здесь будет календарь
          </FormInput>
          <Select
            className={s.format}
            placeholder={lesson?.format ? lesson?.format : 'Формат'}
            options={optionsFormat}
          />
        </>
      )}
    </div>
  )
}
