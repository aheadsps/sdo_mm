import { Typography } from '@shared/components'
import clsx from 'clsx'

import s from '../tests.module.scss'

import { AnswerVariant } from './AnswerVariant/AnswerVariant'

export const QuestionCard = ({id, title, task, answers, selectedAnswer, isCorrectAnswer, onSelect }) => {
  return (
    <div key={task} className={clsx(s.headerQuestion, isCorrectAnswer === true && s.correctAnswer, isCorrectAnswer === false && s.wrongAnswer)}>
      <Typography variant="body_1">{title}</Typography>
      <Typography variant="body_1" className={s.translate}>
        {task}
      </Typography>

      {answers.map((answer) => {
        return (
          <AnswerVariant
            key={answer.id}
            answer={answer.answer}
            isCorrect={answer.isCorrect}
            descr={answer.descr}
            name={`question-${id}`}
            checked={selectedAnswer === answer.id}
            onSelect={() => onSelect(id, answer.id, answer.isCorrect)}
          />
        )
      })}
    </div>
  )
}
