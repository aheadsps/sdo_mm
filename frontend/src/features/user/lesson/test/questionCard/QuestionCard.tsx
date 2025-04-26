import { Typography } from '@shared/components'
import clsx from 'clsx'
import { useState } from 'react'

import s from '../tests.module.scss'

import { AnswerVariant } from './AnswerVariant/AnswerVariant'

export type Answer = {
  id: number
  isCorrect: boolean
  answer: string
  descr: string
}
type Props = {
  title: string
  task: string
  answers: Answer[]
}
export const QuestionCard = ({ title, task, answers }: Props) => {
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null)

  const handleSelect = (answerId: number) => {
    const inputAnswer = answers.find((answer) => answer.id === answerId)
    if (inputAnswer) setSelectedAnswer(inputAnswer)
  }

  return (
    <div
      key={task}
      className={clsx(
        s.headerQuestion,
        selectedAnswer && (selectedAnswer.isCorrect ? s.correctAnswer : s.wrongAnswer)
      )}
    >
      <Typography variant="body_1">{title}</Typography>
      <Typography variant="body_1" className={s.translate}>
        {task}
      </Typography>

      {answers.map((answer) => {
        return (
          <AnswerVariant
            key={answer.id}
            answer={answer}
            isCorrect={answer.isCorrect}
            descr={answer.descr}
            checked={selectedAnswer?.id === answer.id}
            onSelect={() => handleSelect(answer.id)}
            disabled={!!selectedAnswer && selectedAnswer.id !== answer.id}
          />
        )
      })}
    </div>
  )
}
