import { type Option, Select, Textarea, Typography } from '@shared/components'

import { Lesson } from '../Program'

import s from './lesson-content.module.scss'

type Props = {
  lesson?: Lesson
  optionsDate?: Option[]
  optionsFormat?: Option[]
}
export const LessonContent = ({ lesson, optionsDate, optionsFormat }: Props) => {
  return (
    <div className={s.lessonContent}>
      <div className={s.title}>
        {!lesson?.title ? (
          <Textarea placeholder="Введите тему" className={s.textarea} />
        ) : (
          <Typography variant="body_2">{lesson?.title ? lesson.title : 'Введите тему'}</Typography>
        )}
      </div>
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
    </div>
  )
}
