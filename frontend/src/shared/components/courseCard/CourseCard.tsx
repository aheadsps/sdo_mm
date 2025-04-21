import { ArchiveIcon } from '@assets/icons'
import { routes } from '@routes/routes'
import { CourseCovered } from '@services/api'
import { setCurrentCourseId } from '@services/slices'
import { useAppDispatch } from '@services/store'
import { formatDate } from '@shared/utils'
import { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '../button'

import s from './courseCard.module.scss'

type Props = {
  item: CourseCovered
} & ComponentPropsWithoutRef<'div'>

export const CourseCard = ({ item }: Props) => {
  const dispatch = useAppDispatch()
  const hendleClick = () => {
    dispatch(setCurrentCourseId(item.id))
  }
  return (
    <div className={s.card}>
      <h6 className={s.title}>{item.name}</h6>
      <div className={s.content}>
        <div className={s.item}>
          <div className={`${s.itemLeft} ${s.colorGreen}`}>Опубликован</div>
          <div className={s.itemRight}>{formatDate(item.create_date)}</div>
        </div>
        <div className={s.item}>
          <div className={s.itemLeft}>Прогресс: {Math.floor(Math.random() * 100) + 1}</div>
          <div className={s.itemRight}>Учится: {Math.floor(Math.random() * 1500) + 1}</div>
        </div>
      </div>
      <div className={s.buttonBox}>
        <ArchiveIcon />
        <Link to={`${routes.trainingCenterCourse}/${item.id}`}>
          <Button
            variant="secondary"
            children={'Смотреть/ редактировать курс'}
            className={s.btn}
            onClick={() => hendleClick()}
          />
        </Link>
      </div>
    </div>
  )
}
