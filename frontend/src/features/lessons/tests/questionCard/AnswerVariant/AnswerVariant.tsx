// ардиокнопка
//брдер 50 проц
//картинки в public
//button
import clsx from 'clsx'
import { Typography } from '@shared/components'

import s from '../../tests.module.scss'
export const AnswerVariant = (answer, key) => {
console.log(key);
  return (
    <div key={key} className={clsx(s.answers, answer.isCorrect ? s.green : s.red)}>
      <label className={s.option}>
        <input type="radio" name="q1" checked readOnly />{' '}
        <Typography variant="body_1">{answer.answer}</Typography>
      </label>
      <div className={s.explanation}>
        <Typography variant="caption">{answer.isCorrect ? answer.descr: ""}</Typography>
      </div>
    </div>
  )
}
