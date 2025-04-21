import { LikeIcon, DislikeIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { EventShort } from '@services/api/types.api'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Button } from '../button'
import { ImageComponent } from '../image'
import { Typography } from '../typography'

import s from './subscriptionEventsCard.module.scss'

interface Props {
  event: EventShort
}

export const SubscriptionEventsCard: React.FC<Props> = ({ event }: Props) => {
  const course = event.course
  const [isFav, setIsFav] = useState<boolean>(false)
  // const dispatch = useAppDispatch()
  // const hendleClick = () => {}  onClick={() => hendleClick()}
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
        <ImageComponent
          src={course.image !== null ? course.image : 'img/svg/lesson-02.svg'}
          alt="course"
          className={s.img}
        />
      </div>

      <div className={s.container__bottom}>
        <div className={s.container__card}>
          <Typography variant="header_2" className={s.container__title}>
            {course.name}
          </Typography>
          <div className={s.container__description}>
            <Typography variant="body_2" className={s.container__depiction}>
              {course.description}
            </Typography>
          </div>
        </div>
        <Button
          variant="secondary"
          className={s.container__btn}
          children="Записаться на курс"
          // as={NavLink}
          // to={`${routes.course}/${course.id}`}
        />
      </div>
    </div>
  )
}
