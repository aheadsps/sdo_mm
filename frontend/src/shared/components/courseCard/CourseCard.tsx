import { Link } from 'react-router-dom'

import Basket from '@assets/icons/BasketIcon'

import { Button } from '../button'

import s from './courseCard.module.scss'

export const CourseCard = () => {
  return (
    <div className={s.card}>
      <h6 className={s.title}>English Check-Up: Продвинутый разбор</h6>
      <div className={s.content}>
        <div className={s.item}>
          <div className={`${s.itemLeft} ${s.colorGreen}`}>Опубликован</div>
          <div className={s.itemRight}>12.02.2025</div>
        </div>
        <div className={s.item}>
          <div className={s.itemLeft}>Прогресс: 20%</div>
          <div className={s.itemRight}>Учится: 487</div>
        </div>
      </div>
      <div className={s.buttonBox}>
        <Basket />
        <Link to={'/trainingCenter/course'}>
          <Button variant="secondary" children={'Смотреть/ редактировать курс'} className={s.btn} />
        </Link>
      </div>
    </div>
  )
}
