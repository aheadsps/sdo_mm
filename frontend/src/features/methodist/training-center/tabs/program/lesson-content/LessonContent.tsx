import { ArrowRightIcon, CalendarIcon } from '@assets/icons'
import { LessonType, Scorm, StepView } from '@services/api'
import { Button, InputWithIcon, type Option, Select } from '@shared/components'
import { useToggle } from '@shared/hooks'
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
  const { isOpen, toggle } = useToggle()
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
