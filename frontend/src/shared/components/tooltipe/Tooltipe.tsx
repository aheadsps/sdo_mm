import { CloseIcon, TooltipeCheckboxIcon } from '@assets/icons'

import s from './tooltipe.module.scss'

type Props = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}
export const Tooltipe = ({ isOpen, setIsOpen }: Props) => {
  return (
    <div className={s.tooltipe}>
      <div className={s.tooltipe__topBox}>
        <TooltipeCheckboxIcon />
        <div className={s.tooltipe__rightBox} onClick={() => setIsOpen(false)}>
          <p className={s.tooltipe__txt}>12 секунд назад</p>
          <CloseIcon />
        </div>
      </div>
      <div className={s.tooltipe__bottomBox}>
        Курс добавлен в избранное! Теперь ты легко найдёшь его в своём профиле.
      </div>
    </div>
  )
}
