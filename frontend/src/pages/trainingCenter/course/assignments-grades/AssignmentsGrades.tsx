import { Button, Card, Typography } from '@shared/components'

import s from './assignments-grades.module.scss'

export const AssignmentsGrades = () => {
  return (
    <div className={s.cardsBlock}>
      <Card className={s.card}>
        <Typography variant="header_6" className={s.cardTitle}>
          Тест по безопасной эксплуатации электроинструментов
        </Typography>
        <div className={s.infoBlock}>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Дата дедлайна
            </Typography>
            <Typography variant="body_2" className={s.text}>
              01.05.2025{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Проверено
            </Typography>
            <Typography variant="body_2" className={s.text}>
              120 из 150{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Средняя оценка
            </Typography>
            <Typography variant="body_2" className={s.text}>
              7.8 / 10
            </Typography>
          </div>
        </div>
        <Button variant="primary" className={s.button}>
          Список учеников
        </Button>
      </Card>
      <Card className={s.card}>
        <Typography variant="header_6" className={s.cardTitle}>
          Тест по безопасной эксплуатации электроинструментов
        </Typography>
        <div className={s.infoBlock}>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Дата дедлайна
            </Typography>
            <Typography variant="body_2" className={s.text}>
              01.05.2025{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Проверено
            </Typography>
            <Typography variant="body_2" className={s.text}>
              120 из 150{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Средняя оценка
            </Typography>
            <Typography variant="body_2" className={s.text}>
              7.8 / 10
            </Typography>
          </div>
        </div>
        <Button variant="primary" className={s.button}>
          Список учеников
        </Button>
      </Card>
      <Card className={s.card}>
        <Typography variant="header_6" className={s.cardTitle}>
          Тест по безопасной эксплуатации электроинструментов
        </Typography>
        <div className={s.infoBlock}>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Дата дедлайна
            </Typography>
            <Typography variant="body_2" className={s.text}>
              01.05.2025{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Проверено
            </Typography>
            <Typography variant="body_2" className={s.text}>
              120 из 150{' '}
            </Typography>
          </div>
          <div className={s.infoItem}>
            <Typography variant="caption" className={s.caption}>
              Средняя оценка
            </Typography>
            <Typography variant="body_2" className={s.text}>
              7.8 / 10
            </Typography>
          </div>
        </div>
        <Button variant="primary" className={s.button}>
          Список учеников
        </Button>
      </Card>
    </div>
  )
}
