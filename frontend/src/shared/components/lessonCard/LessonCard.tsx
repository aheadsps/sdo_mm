import { ClockIcon, LikeIcon, DislikeIcon, StickersIcon, HourglassIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { Event } from '@services/slices/events'
import { getBackgroundColor, getDaysLeft } from '@shared/utils'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Button } from '../button'
import { ImageComponent } from '../image'
import { Typography } from '../typography'

import s from './lessonCard.module.scss'

interface Props {
  event: Event
}

export const LessonCard: React.FC<Props> = ({ event }: Props) => {
  const [isFav, setIsFav] = useState(false)
  const daysLeft = getDaysLeft(event.end_date)
  const deadlineColor = getBackgroundColor(daysLeft)

  console.log(event.course.image)

  return (
    <div className={s.container}>
      <div className={s.container__top}>
        <div className={s.container__likeBox}>
          <div className={s.container__courseBox}>
            <Typography variant="header_6" className={s.container__course}>
              Курс
            </Typography>
          </div>
          <button className={s.container__like} onClick={() => setIsFav(!isFav)}>
            {isFav ? <LikeIcon /> : <DislikeIcon />}
          </button>
        </div>
        <ImageComponent src={event.course.image} alt="course" className={s.container__img} />
      </div>
      <div className={s.container__bottom}>
        <div className={s.container__card}>
          <Typography variant="header_2" className={s.container__title}>
            {event.course.name}
          </Typography>
          <div className={s.container__description}>
            <div className={s.container__dataBox}>
              <div className={s.container__data}>
                <div className={s.container__param}>
                  <div
                    className={s.container__circle}
                    style={{ backgroundColor: `${deadlineColor}` }}
                  ></div>
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    {event.status === 'process' ? `${daysLeft} дней` : 'Просрочен'}
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <StickersIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    {event.course.lessons.length}
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <HourglassIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    120
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <ClockIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    50%
                  </Typography>
                </div>
              </div>
            </div>
            <Typography variant="body_2" className={s.container__depiction}>
              {event.course.description}
            </Typography>
          </div>
        </div>
        <Button
          className={s.container__btn}
          children="Перейти к обучению"
          as={NavLink}
          to={routes.course}
        />
      </div>
    </div>
  )
}
