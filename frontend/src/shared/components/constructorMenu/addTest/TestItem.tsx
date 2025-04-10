import { InputRadio, Input, Textarea } from '@shared/components'

import s from './add-test.module.scss'

type Props = {
  index: number
  text: string
  comment: string
  isCorrect: boolean
  onChange: (index: number, field: 'text' | 'comment', value: string) => void
  onRadioChange: (index: number) => void
  onCheckboxChange: (index: number) => void
  isOneCorrect: boolean
}

export const TestItem = ({
  index,
  text,
  comment,
  onChange,
  isCorrect,
  onRadioChange,
  onCheckboxChange,
  isOneCorrect,
}: Props) => {
  return (
    <div className={s.testItem}>
      <InputRadio
        type={isOneCorrect ? 'radio' : 'checkbox'}
        checked={isCorrect}
        onChange={() => (isOneCorrect ? onRadioChange(index) : onCheckboxChange(index))}
      />
      <div>
        <Input
          placeholder="Введите текст ответа"
          className={s.input}
          value={text}
          onChange={(e) => onChange(index, 'text', e.target.value)}
        />
        <Textarea
          placeholder="Комментарий (не обязательно)"
          className={s.textarea}
          value={comment}
          onChange={(e) => onChange(index, 'comment', e.target.value)}
        />
      </div>
    </div>
  )
}
