// ардиокнопка
//брдер 50 проц
//картинки в public
//button
import clsx from 'clsx'
import { Typography } from '@shared/components'

import s from '../../tests.module.scss'
export const AnswerVariant = ({ answer, name, isCorrect, descr, checked, onSelect }) => {
  return (
    <div className={clsx(s.answers, isCorrect ? s.green : s.red)}>
      <label className={s.option}>
        <input type="radio" name={name} checked={checked} onChange={onSelect} />{' '}
        <Typography variant="body_1">{answer}</Typography>
      </label>
      <div className={s.explanation}>
        <Typography variant="caption">{checked ? descr : ''}</Typography>
      </div>
    </div>
  )
}
