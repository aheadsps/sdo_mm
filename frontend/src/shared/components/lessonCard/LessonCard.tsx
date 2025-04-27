import { ClockIcon, LikeIcon, DislikeIcon, StickersIcon, HourglassIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { CoverCurrent } from '@services/api/types.api'
import { getBackgroundColor, getDaysLeft } from '@shared/utils'
import { getDeadlineStatus } from '@shared/utils/getDeadlineStatus.ts'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { Button } from '../button'
import { ImageComponent } from '../image'
import { Typography } from '../typography'

import s from './lessonCard.module.scss'

// import noDataImg from '@/public/img/noDataImg.png'

interface Props {
  cover: CoverCurrent
}

export const LessonCard: React.FC<Props> = ({ cover }: Props) => {
  const [isFav, setIsFav] = useState<boolean>(false)
  const course = cover.event.course
  const daysLeft = course.beginner === true ? undefined : getDaysLeft(cover.event.end_date)
  const deadlineColor = getBackgroundColor(daysLeft)

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
            {cover.event.course.name}
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
                    {daysLeft === undefined
                      ? 'Бессрочно'
                      : cover.status !== 'failed' && daysLeft > 0
                        ? getDeadlineStatus(daysLeft)
                        : 'Просрочен'}
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <StickersIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    {cover.event.course.lessons.length}
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <HourglassIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    80
                  </Typography>
                </div>
                <div className={s.container__param}>
                  <ClockIcon />
                  <Typography variant="body_2" className={s.container__paramTxt}>
                    {cover.procent} %
                  </Typography>
                </div>
              </div>
            </div>
            <Typography variant="body_2" className={s.container__depiction}>
              {cover.event.course.description}
            </Typography>
          </div>
        </div>
        <Button
          variant="primary"
          className={s.container__btn}
          children="Перейти к обучению"
          as={NavLink}
          to={`${routes.course}/${cover.event.course.id}`}
        />
      </div>
    </div>
  )
}
