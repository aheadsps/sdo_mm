import { CloseIcon, TooltipeCheckboxIcon } from '@assets/icons'

import s from './tooltipe.module.scss'

export const Tooltipe = () => {
  return (
    <div className={s.container}>
      <div className={s.titleBox}>
        <TooltipeCheckboxIcon />
        <div className={s.rightBox}>
          <p className={s.rightBox__txt}>12 секунд назад</p>
          <CloseIcon />
        </div>
      </div>
      <div className={s.bottomBox}>
        Курс добавлен в избранное! Теперь ты легко найдёшь его в своём профиле.{' '}
      </div>
    </div>
  )
}
