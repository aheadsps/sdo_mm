import { Typography } from '../typography'

import s from './ai.module.scss'

export const AiDescription = () => {
  return (
    <div className={s.aiDescription}>
      <Typography variant="body_2">Привет! Я твой ИИ-помощник.</Typography>
      <Typography variant="body_2">
        Могу помочь разобраться с темами курса, ответить на вопросы или дать дополнительные
        материалы.{' '}
      </Typography>
      <Typography variant="body_2">Просто напиши, что тебя интересует!</Typography>
    </div>
  )
}
