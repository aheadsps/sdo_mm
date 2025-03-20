import { DislikeIcon, LikeIcon } from '@assets/icons'

import ImageComponent from '../img/ImageComponent'

import s from './lessonCard.module.scss'

export const LessonCard = (props) => {
  const isFav: boolean = props.isFav
  return (
    <div className={s.container}>
      <div className={s.container__top}>
        <div className={s.container__likeBox}>
          <div className={s.container__courseBox}>
            <p className={s.container__course}>Курс</p>
          </div>
          <button className={s.container__like}>
            {isFav ? <LikeIcon /> : <DislikeIcon />}
            {/*<LikeIcon />
             <DislikeIcon /> */}
          </button>
        </div>
        <ImageComponent src="/img/svg/lesson.svg" alt="course" className={s.container__img} />
      </div>
      <div className={s.container__bottom}></div>
    </div>
  )
}
