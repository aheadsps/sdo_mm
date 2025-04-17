import { ArrowRightIcon, CalendarIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { LessonType, Scorm, Step } from '@services/api'
import { Button, InputWithIcon, Input, type Option, Select, Typography } from '@shared/components'
import { useToggle } from '@shared/hooks'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import s from './lesson-content.module.scss'

const getDisplayName = (item?: LessonType | Step | Scorm): string => {
  if (!item) return ''
  return 'name' in item ? item.name : item.title
}

type Props<T extends LessonType | Step | Scorm> = {
  lesson?: T
  options?: Option[]
  isExpandableContent?: boolean
}
export const LessonContent = <T extends LessonType | Step | Scorm>({
  lesson,
  options,
  isExpandableContent = false,
}: Props<T>) => {
  const { isOpen, toggle } = useToggle()
  const displayName = getDisplayName(lesson)

  return (
    <div className={s.lessonContent}>
      <div className={s.title}>
        {!displayName ? (
          <Input placeholder="Введите тему" />
        ) : (
          <Typography variant="body_2">{lesson ? displayName : 'Введите тему'}</Typography>
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
            placeholder={'Введите дату урока'}
            content={'Здесь будет календарь'}
            onClick={toggle}
            icon={<CalendarIcon />}
            isOpen={isOpen}
          >
            Здесь будет календарь
          </InputWithIcon>
          <Select className={s.format} placeholder={'Формат'} options={options} />
        </>
      )}
    </div>
  )
}
