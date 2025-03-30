import { Typography } from '@shared/components'

import s from '../tests.module.scss'

import { AnswerVariant } from './AnswerVariant/AnswerVariant'

export const QuestionCard = ({ title, task, answers, id }) => {
  return (
    <div key="testPage" className={s.headerQuestion}>
      <Typography variant="body_1">{title}</Typography>
      <Typography variant="body_1" className={s.translate}>
        {task}
      </Typography>

      {answers.map((answer) => {
        let key= `${answers.indexOf(answer)}_${id}`
        return (
          <AnswerVariant
            key={key}
            answer={answer.answer}
            isCorrect={answer.isCorrect}
            descr={answer.descr}
          />
        )
      })}
    </div>
  )
}
