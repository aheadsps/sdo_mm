import { Button, type Option, Select, Textarea, Typography } from '@shared/components'

import ArrowRightIcon from '@assets/icons/ArrowLeftIcon'

import { LessonType } from '../data'

import s from './lesson-content.module.scss'

type Props = {
  lesson?: LessonType
  optionsDate?: Option[]
  optionsFormat?: Option[]
  isExpandableContent?: boolean
}
export const LessonContent = ({
  lesson,
  optionsDate,
  optionsFormat,
  isExpandableContent = false,
}: Props) => {
  return (
    <div className={s.lessonContent}>
      <div className={s.title}>
        {!lesson?.title ? (
          <Textarea placeholder="Введите тему" className={s.textarea} />
        ) : (
          <Typography variant="body_2">{lesson?.title ? lesson.title : 'Введите тему'}</Typography>
        )}
      </div>
      {isExpandableContent ? (
        <>
          <Select
            className={s.date}
            placeholder={lesson?.dateTime ? lesson.dateTime : 'Введите дату урока'}
            options={optionsDate}
          />
          <Button variant="secondary" className={s.constructorBtn}>
            <ArrowRightIcon width={'12px'} height={'12px'} />
          </Button>
        </>
      ) : (
        <>
          <Select
            className={s.date}
            placeholder={lesson?.dateTime ? lesson.dateTime : 'Введите дату урока'}
            options={optionsDate}
          />
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
