import { ArrowRightIcon } from '@assets/icons'
import { LessonType, Scorm, StepView } from '@services/api'
import { Button, type Option, Select } from '@shared/components'
import { DatePickerCustom } from '@shared/components/datePicker/DatePickerCustom'
import clsx from 'clsx'
import { NavLink } from 'react-router-dom'

import { EditableTitle } from './EditableTitle'
import s from './lesson-content.module.scss'

const getDisplayName = (item?: LessonType | StepView | Scorm): string => {
  if (!item) return ''
  return 'name' in item ? item.name : item.title
}

type Props<T extends LessonType | StepView | Scorm> = {
  lesson?: T
  options?: Option[]
  isExpandableContent?: boolean
  onClick?: () => void
  path?: string
  isStep?: boolean
}
export const LessonContent = <T extends LessonType | StepView | Scorm>({
  lesson,
  options,
  isExpandableContent = false,
  path,
  onClick,
  isStep = false,
}: Props<T>) => {
  const displayName = getDisplayName(lesson)

  return (
    <div className={s.lessonContent}>
      <EditableTitle displayName={displayName} isStep={isStep} />
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
            to={path as string}
            onClick={onClick}
          >
            <ArrowRightIcon />
          </Button>
        </>
      ) : (
        <>
          <DatePickerCustom className={s.formInput} placeholder={'Введите дату урока'} />
          <Select className={s.format} placeholder={'Формат'} options={options} />
        </>
      )}
    </div>
  )
}
