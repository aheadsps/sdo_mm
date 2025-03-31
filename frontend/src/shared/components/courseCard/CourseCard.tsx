import Basket from '@assets/icons/Basket'

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
          <div className={s.itemLeft}>Прогресс завершенных: 20%</div>
          <div className={s.itemRight}>Учится: 487</div>
        </div>
      </div>
      <div className={s.buttonBox}>
        <Basket />
        <Button variant="secondary" children={'Смотреть/ редактировать курс'} className={s.btn} />
      </div>
    </div>
  )
}
