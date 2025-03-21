import { ReactNode, useState } from 'react'

import { ClockIcon, DislikeIcon, HourglassIcon, LikeIcon, StickersIcon } from '@assets/icons'

import { Button } from '../button'
import ImageComponent from '../img/ImageComponent'

import s from './lessonCard.module.scss'
import { Course, Lesson } from '@pages/my-learning'
import clsx from 'clsx'

interface Props {
  course: Course | Lesson
  children?: ReactNode // Универсальный тип для children
}

export const LessonCard: React.FC<Props> = (props) => {
  const item = props.course
  const status = item.status
  //   : () => string | undefined = () => {
  //     if (item.status === 0) return 's.container__circle_green'
  //     if (item.status === 1) return 's.container__circle_orange'
  //     if (item.status === 2) return 's.container__circle_red'
  //   }
  const [isFav, setIsFav] = useState(false)
  return (
    <div className={s.container}>
      <div className={s.container__top}>
        <div className={s.container__likeBox}>
          <div className={s.container__courseBox}>
            <p className={s.container__course}>Курс</p>
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
            <div className={s.container__data}>
              <div className={s.container__param}>
                <div className={`${s.container__circle} ${s.container__circle_green}`}></div>
                <p className={s.container__paramTxt}>{item.days}</p>
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
            <p className={s.container__depiction}>{item.description}</p>
          </div>
        </div>
        <Button className={s.container__btn} children="Перейти к обучению" />
      </div>
    </div>
  )
}
