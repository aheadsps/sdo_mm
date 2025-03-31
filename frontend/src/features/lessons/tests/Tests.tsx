import { Button, Typography } from '@shared/components'
import React from 'react'
import { useState } from 'react'
import { cards, pictureCards } from './questionCard/AnswerVariant/questionsData'
import { QuestionCard } from './questionCard/QuestionCard'
import { PictureCard } from './pictureCard/PictureCard'
// import { DropdownCard } from '@features/course'
import s from './tests.module.scss'

export const LessonTest = () => {
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const handleSelect = (questionId, answerId, isCorrect) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: { answerId, isCorrect },
    }))
  }

  return (
    <div className={s.lessonTest}>
      <div className={s.headerBlock}>
        <Typography variant="header_6" className={s.header}>
          <span>7. Тестирование</span> <span className={s.spanGrey}>7/7</span>
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
              id={card.id}
              title={card.title}
              task={card.task}
              answers={card.answers}
              selectedAnswer={selectedAnswers[card.id]?.answerId}
              isCorrectAnswer={selectedAnswers[card.id]?.isCorrect}
              onSelect={handleSelect}
            />
          )
        })}
        {pictureCards.map((card) => {
          return <PictureCard key={card.id} title={card.title} answers={card.answers} />
        })}
      </div>

      <div className={s.buttons}>
        <Button className={s.exit} variant="primary">
          Выйти из урока
        </Button>
        <Button className={s.next} variant="secondary">
          Перейти к следующей теме
        </Button>
      </div>
    </div>
  )
}

// export default LessonTest
