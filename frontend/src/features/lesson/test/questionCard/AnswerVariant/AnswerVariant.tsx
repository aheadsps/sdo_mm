import { InputRadio, Typography } from '@shared/components'
import clsx from 'clsx'

import s from '../../tests.module.scss'
import { Answer } from '../QuestionCard'

type Props = {
  answer: Answer
  isCorrect: boolean
  descr: string
  checked: boolean
  onSelect: () => void
  disabled?: boolean
}
export const AnswerVariant = ({ answer, isCorrect, descr, checked, onSelect, disabled }: Props) => {
  return (
    <div className={clsx(s.answers, isCorrect ? s.green : s.red)}>
      <label className={clsx(s.option, disabled && s.disabled)}>
        <InputRadio checked={checked} onChange={onSelect} disabled={disabled} />{' '}
        <Typography variant="body_1">{answer.answer}</Typography>
      </label>
      <div className={s.explanation}>
        <Typography variant="caption">{checked ? descr : ''}</Typography>
      </div>
    </div>
  )
}
