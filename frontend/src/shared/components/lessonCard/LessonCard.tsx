import { ReactNode, useState } from 'react'

import { ClockIcon, DislikeIcon, HourglassIcon, LikeIcon, StickersIcon } from '@assets/icons'
import { Course } from '@pages/my-learning'

import { Button } from '../button'
import { ImageComponent } from '../image'

import s from './lessonCard.module.scss'

interface Props {
  course: Course
  children?: ReactNode // Универсальный тип для children
}

export const LessonCard: React.FC<Props> = (props) => {
  const item = props.course
  const status = Number(item.status)
  const [isFav, setIsFav] = useState(false)
  return (
    <div className={s.container}>
      <div className={s.container__top}>
        <div className={s.container__likeBox}>
          <div className={s.container__courseBox}>
            <p className={s.container__course}>{item.isCourse ? 'Курс' : 'Урок'}</p>
          </div>
          <button className={s.container__like} onClick={() => setIsFav(!isFav)}>
            {isFav ? <LikeIcon /> : <DislikeIcon />}
          </button>
        </div>
        <ImageComponent src={item.src} alt="course" className={s.container__img} />
      </div>
      <div className={s.container__bottom}>
        <div className={s.container__card}>
          <h2 className={s.container__title}>{item.name}</h2>
          <div className={s.container__description}>
            <div className={s.container__dataBox}>
              <div className={s.container__data}>
                <div className={s.container__param}>
                  <div
                    className={
                      status > 1
                        ? s.container__circle_red
                        : status < 1
                          ? s.container__circle_green
                          : s.container__circle_orange
                    }
                  ></div>
                  <p className={s.container__paramTxt}>{status > 1 ? 'Просрочен' : item.days}</p>
                </div>
                <div className={s.container__param}>
                  <StickersIcon />
                  <p className={s.container__paramTxt}>{item.lessons}</p>
                </div>
                <div className={s.container__param}>
                  <HourglassIcon />
                  <p className={s.container__paramTxt}>{item.time}</p>
                </div>
                <div className={s.container__param}>
                  <ClockIcon />
                  <p className={s.container__paramTxt}>{item.progress}</p>
                </div>
              </div>
            </div>
            <p className={s.container__depiction}>{item.description}</p>
          </div>
        </div>
        <Button className={s.container__btn} children="Перейти к обучению" />
      </div>
    </div>
  )
}
