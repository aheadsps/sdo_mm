import { ComponentPropsWithRef, useState } from 'react'

import { DislikeIcon, LikeIcon } from '@assets/icons'

import ImageComponent from '../img/ImageComponent'

import s from './lessonCard.module.scss'

// type Props = {
//   course?: {}
// }

type Course = {
  id: string
  name: string
  discription: string
  days: string
  lessons: string
  time: string
  progress: string
  // isFav: boolean,
}

export const LessonCard: React.FC = ({ course }: Course) => {
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
        <ImageComponent src="/img/svg/lesson.svg" alt="course" className={s.container__img} />
      </div>
      <div className={s.container__bottom}></div>
    </div>
  )
}
