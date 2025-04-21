import { ClockIcon, LikeIcon, DislikeIcon, StickersIcon, HourglassIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { CoverCurrent } from '@services/api/types.api'
import { getBackgroundColor, getDaysLeft } from '@shared/utils'
// import { getDeadlineStatus } from '@shared/utils/getDeadlineStatus.ts'
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
  const course = cover.event.course
  const daysLeft = cover.event.end_date ? getDaysLeft(cover.event.end_date) : 10
  const deadlineColor = getBackgroundColor(daysLeft)
  // const dispatch = useAppDispatch()
  // console.log(cover)
  const hendleClick = () => {
    // dispatch(setIsScorms(isScorm))
    // if (isScorm) dispatch(setCurrentScorms(scorms))
    // else dispatch(setCurrentEventId(cover.event.id))
    // dispatch(setEvent(cover.event))
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
            {cover.favorite ? <LikeIcon /> : <DislikeIcon />}
          </button>
        </div>
        <ImageComponent src={course.image} alt="course" className={s.img} />
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
                    {course.beginner === true
                      ? 'Бессрочно'
                      : cover.status === 'process' && daysLeft > 0
                        ? `${daysLeft} дней`
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
                    120
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
          className={s.container__btn}
          children="Перейти к обучению"
          as={NavLink}
          to={`${routes.course}/${cover.event.course.id}`}
          onClick={() => hendleClick()}
        />
      </div>
    </div>
  )
}
