import { ClockIcon, LikeIcon, DislikeIcon, StickersIcon, HourglassIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { EventShort } from '@services/api/types.api'
import { getBackgroundColor, getDaysLeft } from '@shared/utils'
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
  const daysLeft = course.beginner === true ? undefined : getDaysLeft(event.end_date)
  const deadlineColor = getBackgroundColor(daysLeft)
  // const dispatch = useAppDispatch()
  const hendleClick = () => {}
   return (
     <div  className={s.container}>
      <div className={s.container__top}>
              <div className={s.container__likeBox}>
                <div className={s.container__courseBox}>
                  <Typography variant="header_6" className={s.container__course}>
                    Курс
                  </Typography>
                </div>
                <button className={s.container__like} onClick={() => hendleClick()}>
                  <DislikeIcon />
                  // {cover.favorite ? <LikeIcon /> : <DislikeIcon />}
                </button>
              </div>
              <ImageComponent src={course.image} alt="course" className={s.img} />
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
                      variant='secondary'
                      className={s.container__btn}
                      children='Записаться на курс'
                      as={NavLink}
                      to={`${routes.course}/${course.id}`}
                    />
                  </div>
     </div>
    )
}
