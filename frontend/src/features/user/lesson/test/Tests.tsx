import { routes } from '@routes/routes'
import { Button, Typography } from '@shared/components'
import { NavLink, useParams } from 'react-router-dom'

import { PictureCard } from './pictureCard/PictureCard'
import { cards, pictureCards } from './questionCard/AnswerVariant/questionsData'
import { QuestionCard } from './questionCard/QuestionCard'
import s from './tests.module.scss'

export const LessonTest = () => {
  const { id } = useParams()
  return (
    <div className={s.lessonTest}>
      <div className={s.headerBlock}>
        <Typography variant="header_6" className={s.header}>
          <span>Тестирование</span>
          {/* <span className={s.spanGrey}>7/7</span> */}
        </Typography>
        <Typography variant="body_2" className={s.subtitle}>
          Давай потренируемся!
        </Typography>
      </div>
      <div className={s.questionBlock}>
        {cards.map((card) => {
          return (
            <QuestionCard
              key={card.id}
              title={card.title}
              task={card.task}
              answers={card.answers}
            />
          )
        })}
        {pictureCards.map((card) => {
          return <PictureCard key={card.id} title={card.title} answers={card.answers} />
        })}
      </div>
      <div className={s.buttons}>
        <Button variant="primary" as={NavLink} to={`${routes.course}/${id}`}>
          Выйти из урока
        </Button>
        <Button variant="secondary" disabled={true} isIcon>
          Перейти к следующей теме
        </Button>
      </div>
    </div>
  )
}
