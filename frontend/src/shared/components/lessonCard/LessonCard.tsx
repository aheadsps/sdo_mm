import { ClockIcon, LikeIcon, DislikeIcon, StickersIcon, HourglassIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { Event } from '@services/api'
import { setCurrentEventId, setCurrentScorms, setEvent, setIsScorms } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { getBackgroundColor, getDaysLeft } from '@shared/utils'
import { NavLink } from 'react-router-dom'

import { Button } from '../button'
import { ImageComponent } from '../image'
import { Typography } from '../typography'

import s from './lessonCard.module.scss'

interface Props {
  event: Event
}

export const LessonCard: React.FC<Props> = ({ event }: Props) => {
  const daysLeft = getDaysLeft(event.end_date)
  const deadlineColor = getBackgroundColor(daysLeft)
  const dispatch = useAppDispatch()
  console.log(event)
  const scorms = event.course.scorms
  const isScorm = Boolean(scorms.length > 0)
  const hendleClick = () => {
    dispatch(setIsScorms(isScorm))
    if (isScorm) dispatch(setCurrentScorms(scorms))
    else dispatch(setCurrentEventId(event.id))
    dispatch(setEvent(event))
  }
  return (
    <div className={s.container}>
      <div className={s.container__top}>
        <div className={s.container__likeBox}>
          <div className={s.container__courseBox}>
            <Typography variant="header_6" className={s.container__course}>
              Курс
            </Typography>
          </div>
          <button className={s.container__like}>
            {event.favorite ? <LikeIcon /> : <DislikeIcon />}
          </button>
        </div>
        <ImageComponent src={event.course.image} alt="course" className={s.img} />
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
                    {event.status === 'process' && daysLeft > 0 ? `${daysLeft} дней` : 'Просрочен'}
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <StickersIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    {event.done_lessons}
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
          to={`${routes.course}/${event.course.id}`}
          onClick={() => hendleClick()}
        />
      </div>
    </div>
  )
}
